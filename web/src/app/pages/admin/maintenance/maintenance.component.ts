import {
  Component,
  Inject,
  Optional,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { MaintenanceService } from './maintenance.service';

export interface Maintenance {
  id: number;
  description: string;
  device_id: number;
  performed_by: number;
  created_at: string;
  updated_at: string;
}

@Component({
  templateUrl: './maintenance.component.html',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgScrollbarModule,
    CommonModule,
  ],
  providers: [DatePipe],
})
export class AppMaintenanceComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    'id',
    'description',
    'device_id',
    'performed_by',
    'created_at',
    'action',
  ];
  dataSource = new MatTableDataSource<Maintenance>([]);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private maintenanceService: MaintenanceService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadMaintenanceLogs();
  }

  loadMaintenanceLogs(): void {
    this.maintenanceService.getAll().subscribe({
      next: (logs) => {
        this.dataSource.data = logs;
      },
      error: (err) => {
        console.error('Error al obtener registros de mantenimiento:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppMaintenanceDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.addRowData(result.data);
      } else if (result?.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result?.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj: Maintenance): void {
    const currentData = this.dataSource.data;
    this.dataSource.data = [row_obj, ...currentData];
    this.table.renderRows();
  }

  updateRowData(row_obj: Maintenance): void {
    this.maintenanceService.update(row_obj).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((log) =>
          log.id === res.id ? res : log
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al actualizar registro de mantenimiento:', err);
      },
    });
  }

  deleteRowData(row_obj: Maintenance): void {
    this.maintenanceService.delete(row_obj.id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(
          (log) => log.id !== row_obj.id
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al eliminar registro de mantenimiento:', err);
      },
    });
  }
}

@Component({
  selector: 'app-maintenance-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    MaterialModule,
    TablerIconsModule,
    CommonModule,
  ],
  providers: [DatePipe],
  templateUrl: 'maintenance-dialog-component.html',
})
export class AppMaintenanceDialogComponent {
  public action: string;
  local_data: any;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppMaintenanceDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Maintenance,
    private maintenanceService: MaintenanceService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    if (this.action === 'Add') {
      const payload = {
        description: this.local_data.description,
        device_id: this.local_data.device_id,
        performed_by: this.local_data.performed_by,
      };

      this.maintenanceService.create(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al crear registro de mantenimiento:', err);
        },
      });
    } else if (this.action === 'Update') {
      const payload = {
        id: this.local_data.id,
        description: this.local_data.description,
        device_id: this.local_data.device_id,
        performed_by: this.local_data.performed_by,
      };

      this.maintenanceService.update(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al actualizar registro de mantenimiento:', err);
        },
      });
    } else if (this.action === 'Delete') {
      this.dialogRef.close({ event: this.action, data: this.local_data });
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

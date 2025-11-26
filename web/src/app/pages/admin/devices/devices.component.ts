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
import { DevicesService } from './devices.service';
import { TranslateModule } from '@ngx-translate/core';

export interface Device {
  id: number;
  model: string;
  user_id: number;
  is_active: boolean;
  assigned_at: string;
  created_at: string;
  updated_at: string | null;
}

@Component({
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgScrollbarModule,
    CommonModule,
    TranslateModule,
  ],
  providers: [DatePipe],
})
export class AppDevicesComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    'id',
    'model',
    'user_id',
    'active',
    'assigned',
    'action',
  ];
  dataSource = new MatTableDataSource<Device>([]);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private devicesService: DevicesService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadDevices();
  }

  loadDevices(): void {
    this.devicesService.getAll().subscribe({
      next: (devices) => {
        this.dataSource.data = devices;
      },
      error: (err) => {
        console.error('Error al obtener dispositivos:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppDevicesDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.addRowData(result.data);
      } else if (result?.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result?.event === 'Delete') {
        this.deleteRowData(result.data);
      } else if (result?.event === 'Reactivate') {
        this.reactivateRowData(result.data);
      }
    });
  }

  addRowData(row_obj: Device): void {
    const currentData = this.dataSource.data;
    this.dataSource.data = [row_obj, ...currentData];
    this.table.renderRows();
  }

  updateRowData(row_obj: Device): void {
    this.devicesService.update(row_obj).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((device) =>
          device.id === res.id ? res : device
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al actualizar dispositivo:', err);
      },
    });
  }

  deleteRowData(row_obj: Device): void {
    const updatePayload = {
      id: row_obj.id,
      model: row_obj.model,
      user_id: row_obj.user_id,
      is_active: false
    };

    this.devicesService.update(updatePayload).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((device) =>
          device.id === res.id ? res : device
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al desactivar dispositivo:', err);
      },
    });
  }

  reactivateRowData(row_obj: Device): void {
    const updatePayload = {
      id: row_obj.id,
      model: row_obj.model,
      user_id: row_obj.user_id,
      is_active: true
    };

    this.devicesService.update(updatePayload).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((device) =>
          device.id === res.id ? res : device
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al reactivar dispositivo:', err);
      },
    });
  }
}

@Component({
  selector: 'app-devices-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    MaterialModule,
    TablerIconsModule,
    CommonModule,
    TranslateModule,
  ],
  providers: [DatePipe],
  templateUrl: 'devices-dialog-component.html',
})
export class AppDevicesDialogComponent {
  public action: string;
  local_data: any;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppDevicesDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Device,
    private devicesService: DevicesService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    if (this.action === 'Add') {
      const payload = {
        model: this.local_data.model,
        user_id: this.local_data.user_id,
      };

      this.devicesService.create(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al crear dispositivo:', err);
        },
      });
    } else if (this.action === 'Update') {
      const payload = {
        id: this.local_data.id,
        model: this.local_data.model,
        user_id: this.local_data.user_id,
        is_active: this.local_data.is_active,
      };

      this.devicesService.update(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al actualizar dispositivo:', err);
        },
      });
    } else if (this.action === 'Delete') {
      this.dialogRef.close({ event: this.action, data: this.local_data });
    }
  }

  doActionReactivate(): void {
    this.dialogRef.close({ event: 'Reactivate', data: this.local_data });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

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
import { IncidentsService } from './incidents.service';

export interface Incident {
  id: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id: number;
  device_id: number;
  reading_id: number;
  created_at: string;
  updated_at: string | null;
}

@Component({
  templateUrl: './incidents.component.html',
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
export class AppIncidentsComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    'id',
    'description',
    'severity',
    'user_id',
    'device_id',
    'reading_id',
    'created',
    'action',
  ];
  dataSource = new MatTableDataSource<Incident>([]);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private incidentsService: IncidentsService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadIncidents();
  }

  loadIncidents(): void {
    this.incidentsService.getAll().subscribe({
      next: (incidents) => {
        this.dataSource.data = incidents;
      },
      error: (err) => {
        console.error('Error al obtener reportes de incidentes:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'low':
        return 'bg-success';
      case 'medium':
        return 'bg-warning';
      case 'high':
        return 'bg-error';
      case 'critical':
        return 'bg-error';
      default:
        return 'bg-secondary';
    }
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppIncidentsDialogComponent, {
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

  addRowData(row_obj: Incident): void {
    const currentData = this.dataSource.data;
    this.dataSource.data = [row_obj, ...currentData];
    this.table.renderRows();
  }

  updateRowData(row_obj: Incident): void {
    this.incidentsService.update(row_obj).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((incident) =>
          incident.id === res.id ? res : incident
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al actualizar reporte de incidente:', err);
      },
    });
  }

  deleteRowData(row_obj: Incident): void {
    this.incidentsService.delete(row_obj.id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(
          (incident) => incident.id !== row_obj.id
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al eliminar reporte de incidente:', err);
      },
    });
  }
}

@Component({
  selector: 'app-incidents-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    MaterialModule,
    TablerIconsModule,
    CommonModule,
  ],
  providers: [DatePipe],
  templateUrl: 'incidents-dialog-component.html',
})
export class AppIncidentsDialogComponent {
  public action: string;
  local_data: any;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppIncidentsDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Incident,
    private incidentsService: IncidentsService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    if (this.action === 'Add') {
      const payload = {
        description: this.local_data.description,
        severity: this.local_data.severity,
        user_id: this.local_data.user_id,
        device_id: this.local_data.device_id,
        reading_id: this.local_data.reading_id,
      };

      this.incidentsService.create(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al crear reporte de incidente:', err);
        },
      });
    } else if (this.action === 'Update') {
      const payload = {
        id: this.local_data.id,
        description: this.local_data.description,
        severity: this.local_data.severity,
        user_id: this.local_data.user_id,
        device_id: this.local_data.device_id,
        reading_id: this.local_data.reading_id,
      };

      this.incidentsService.update(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al actualizar reporte de incidente:', err);
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

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
import { AlertsService } from './alerts.service';

export interface Alert {
  id: number;
  alert_type: string;
  severity: 'low' | 'medium' | 'high';
  reading_id: number;
  timestamp: string;
}

@Component({
  templateUrl: './alerts.component.html',
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
export class AppAlertsComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    'id',
    'alert_type',
    'severity',
    'reading_id',
    'timestamp',
    'action',
  ];
  dataSource = new MatTableDataSource<Alert>([]);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private alertsService: AlertsService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.alertsService.getAll().subscribe({
      next: (alerts) => {
        this.dataSource.data = alerts;
      },
      error: (err) => {
        console.error('Error al obtener alertas:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppAlertsDialogComponent, {
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

  addRowData(row_obj: Alert): void {
    const currentData = this.dataSource.data;
    this.dataSource.data = [row_obj, ...currentData];
    this.table.renderRows();
  }

  updateRowData(row_obj: Alert): void {
    this.alertsService.update(row_obj).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((alert) =>
          alert.id === res.id ? res : alert
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al actualizar alerta:', err);
      },
    });
  }

  deleteRowData(row_obj: Alert): void {
    this.alertsService.delete(row_obj.id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(
          (alert) => alert.id !== row_obj.id
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al eliminar alerta:', err);
      },
    });
  }
}

@Component({
  selector: 'app-alerts-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    MaterialModule,
    TablerIconsModule,
    CommonModule,
  ],
  providers: [DatePipe],
  templateUrl: 'alerts-dialog-component.html',
})
export class AppAlertsDialogComponent {
  public action: string;
  local_data: any;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppAlertsDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Alert,
    private alertsService: AlertsService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    if (this.action === 'Add') {
      const payload = {
        alert_type: this.local_data.alert_type,
        severity: this.local_data.severity,
        reading_id: this.local_data.reading_id,
      };

      this.alertsService.create(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al crear alerta:', err);
        },
      });
    } else if (this.action === 'Update') {
      const payload = {
        id: this.local_data.id,
        alert_type: this.local_data.alert_type,
        severity: this.local_data.severity,
        reading_id: this.local_data.reading_id,
      };

      this.alertsService.update(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al actualizar alerta:', err);
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

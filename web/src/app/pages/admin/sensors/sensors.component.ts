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
import { SensorsService } from './sensors.service';
import { TranslateModule } from '@ngx-translate/core';

export interface Sensor {
  id: number;
  device_id: number;
  sensor_type: 'mq7' | 'pulse' | 'accelerometer' | 'gyroscope';
  name: string;
  unit: string;
  min_threshold?: number;
  max_threshold?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

@Component({
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss'],
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
export class AppSensorsComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    'id',
    'device_id',
    'sensor_type',
    'name',
    'unit',
    'thresholds',
    'active',
    'action',
  ];
  dataSource = new MatTableDataSource<Sensor>([]);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private sensorsService: SensorsService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadSensors();
  }

  loadSensors(): void {
    this.sensorsService.getAll().subscribe({
      next: (sensors) => {
        this.dataSource.data = sensors;
      },
      error: (err) => {
        console.error('Error al obtener sensores:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppSensorsDialogComponent, {
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

  addRowData(row_obj: Sensor): void {
    const currentData = this.dataSource.data;
    this.dataSource.data = [row_obj, ...currentData];
    this.table.renderRows();
  }

  updateRowData(row_obj: Sensor): void {
    this.sensorsService.update(row_obj).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((sensor) =>
          sensor.id === res.id ? res : sensor
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al actualizar sensor:', err);
      },
    });
  }

  deleteRowData(row_obj: Sensor): void {
    const updatePayload = {
      id: row_obj.id,
      is_active: false
    };

    this.sensorsService.update(updatePayload).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((sensor) =>
          sensor.id === res.id ? res : sensor
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al desactivar sensor:', err);
      },
    });
  }

  reactivateRowData(row_obj: Sensor): void {
    const updatePayload = {
      id: row_obj.id,
      is_active: true
    };

    this.sensorsService.update(updatePayload).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((sensor) =>
          sensor.id === res.id ? res : sensor
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al reactivar sensor:', err);
      },
    });
  }
}

@Component({
  selector: 'app-sensors-dialog',
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
  templateUrl: 'sensors-dialog-component.html',
})
export class AppSensorsDialogComponent {
  public action: string;
  local_data: any;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppSensorsDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Sensor,
    private sensorsService: SensorsService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    if (this.action === 'Add') {
      const payload = {
        device_id: this.local_data.device_id,
        sensor_type: this.local_data.sensor_type,
        name: this.local_data.name,
        unit: this.local_data.unit,
        min_threshold: this.local_data.min_threshold,
        max_threshold: this.local_data.max_threshold,
      };

      this.sensorsService.create(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al crear sensor:', err);
        },
      });
    } else if (this.action === 'Update') {
      const payload = {
        id: this.local_data.id,
        device_id: this.local_data.device_id,
        sensor_type: this.local_data.sensor_type,
        name: this.local_data.name,
        unit: this.local_data.unit,
        min_threshold: this.local_data.min_threshold,
        max_threshold: this.local_data.max_threshold,
        is_active: this.local_data.is_active,
      };

      this.sensorsService.update(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al actualizar sensor:', err);
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

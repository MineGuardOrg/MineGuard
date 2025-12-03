import {
  Component,
  Inject,
  Optional,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import {
  MatTableDataSource,
  MatTable,
  MatTableModule,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { AppAddKichenSinkComponent } from './add/add.component';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { DashboardService } from '../../../services/dashboard.service';
import { TranslateModule } from '@ngx-translate/core';

export interface Alert {
  id: number;
  tipo: string;
  mensaje: string;
  trabajador: string;
  area: string | null;
  severidad: string;
  timestamp: string;
  estado: string | null;
  valor: number | null;
  user_id: number;
  device_id: number;
  reading_id: number;
}

@Component({
  selector: 'app-recent-alerts',
  templateUrl: './recent-alerts.component.html',
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
export class AppRecentAlertsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  displayedColumns: string[] = [
    'timestamp',
    'tipo',
    'trabajador',
    'area',
    'severidad',
    // 'acciones',
  ];
  dataSource = new MatTableDataSource<Alert>([]);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadRecentAlerts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Carga las alertas recientes desde el endpoint
   */
  loadRecentAlerts(): void {
    this.dashboardService.getRecentAlerts(7, 20).subscribe({
      next: (alerts) => {
        this.dataSource.data = alerts;
      },
      error: (error) => {
        console.error('Error loading recent alerts:', error);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppRecentAlertsDialogContentComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addRowData(result.data);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  // tslint:disable-next-line - Disables all
  addRowData(row_obj: Alert): void {
    this.dataSource.data.unshift({
      id: this.dataSource.data.length + 1,
      tipo: row_obj.tipo,
      mensaje: row_obj.mensaje,
      trabajador: row_obj.trabajador,
      area: row_obj.area,
      severidad: row_obj.severidad,
      timestamp: row_obj.timestamp,
      estado: row_obj.estado,
      valor: row_obj.valor,
      user_id: row_obj.user_id,
      device_id: row_obj.device_id,
      reading_id: row_obj.reading_id,
    });
    this.dialog.open(AppAddKichenSinkComponent);
    this.table.renderRows();
  }

  // tslint:disable-next-line - Disables all
  updateRowData(row_obj: Alert): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      if (value.id === row_obj.id) {
        value.tipo = row_obj.tipo;
        value.mensaje = row_obj.mensaje;
        value.trabajador = row_obj.trabajador;
        value.area = row_obj.area;
        value.severidad = row_obj.severidad;
        value.timestamp = row_obj.timestamp;
        value.estado = row_obj.estado;
        value.valor = row_obj.valor;
      }
      return true;
    });
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: Alert): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      return value.id !== row_obj.id;
    });
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MaterialModule],
  providers: [DatePipe],
  templateUrl: 'recent-alerts-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppRecentAlertsDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  
  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppRecentAlertsDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Alert
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }


}

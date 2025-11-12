import {
  Component,
  Inject,
  Optional,
  ViewChild,
  AfterViewInit,
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

export interface Alert {
  id: number;
  hora: Date;
  tipo: string;
  empleado: string;
  area: string;
  severidad: string;
}

const alerts = [
  {
    id: 1,
    hora: new Date('2025-11-11T08:30:00'),
    tipo: 'Gases tóxicos',
    empleado: 'Juan Pérez',
    area: 'Túnel Principal',
    severidad: 'Alta',
  },
  {
    id: 2,
    hora: new Date('2025-11-11T09:15:00'),
    tipo: 'Ritmo cardíaco anormal',
    empleado: 'María González',
    area: 'Zona de Extracción A',
    severidad: 'Media',
  },
  {
    id: 3,
    hora: new Date('2025-11-11T10:45:00'),
    tipo: 'Temperatura corporal alta',
    empleado: 'Carlos López',
    area: 'Área de Maquinaria',
    severidad: 'Media',
  },
  {
    id: 4,
    hora: new Date('2025-11-11T11:20:00'),
    tipo: 'Caídas/Impactos',
    empleado: 'Ana Martínez',
    area: 'Escaleras Sector B',
    severidad: 'Alta',
  },
  {
    id: 5,
    hora: new Date('2025-11-11T12:05:00'),
    tipo: 'Gases tóxicos',
    empleado: 'Roberto Silva',
    area: 'Ventilación Norte',
    severidad: 'Crítica',
  },
  {
    id: 6,
    hora: new Date('2025-11-11T13:30:00'),
    tipo: 'Ritmo cardíaco anormal',
    empleado: 'Luis Torres',
    area: 'Zona de Carga',
    severidad: 'Baja',
  },
  {
    id: 7,
    hora: new Date('2025-11-11T14:15:00'),
    tipo: 'Temperatura corporal alta',
    empleado: 'Sofia Ramírez',
    area: 'Túnel Secundario',
    severidad: 'Media',
  },
  {
    id: 8,
    hora: new Date('2025-11-11T15:00:00'),
    tipo: 'Caídas/Impactos',
    empleado: 'Diego Morales',
    area: 'Plataforma Sur',
    severidad: 'Alta',
  },
];

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
  ],
  providers: [DatePipe],
})
export class AppRecentAlertsComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  displayedColumns: string[] = [
    'hora',
    'tipo',
    'empleado',
    'area',
    'severidad',
    'acciones',
  ];
  dataSource = new MatTableDataSource(alerts);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
      id: alerts.length + 1,
      hora: row_obj.hora,
      tipo: row_obj.tipo,
      empleado: row_obj.empleado,
      area: row_obj.area,
      severidad: row_obj.severidad,
    });
    this.dialog.open(AppAddKichenSinkComponent);
    this.table.renderRows();
  }

  // tslint:disable-next-line - Disables all
  updateRowData(row_obj: Alert): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      if (value.id === row_obj.id) {
        value.hora = row_obj.hora;
        value.tipo = row_obj.tipo;
        value.empleado = row_obj.empleado;
        value.area = row_obj.area;
        value.severidad = row_obj.severidad;
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

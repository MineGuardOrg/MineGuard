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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';

export interface Worker {
  id: number;
  trabajador: string;
  area: string;
  ritmoCardiaco: number;
  temperatura: number;
  bateria: number;
  estado: string;
}

const workers = [
  {
    id: 1,
    trabajador: 'Juan Pérez',
    area: 'Túnel Principal',
    ritmoCardiaco: 72,
    temperatura: 36.5,
    bateria: 85,
    estado: 'Activo',
  },
  {
    id: 2,
    trabajador: 'María González',
    area: 'Zona de Extracción A',
    ritmoCardiaco: 68,
    temperatura: 36.8,
    bateria: 92,
    estado: 'Activo',
  },
  {
    id: 3,
    trabajador: 'Carlos López',
    area: 'Área de Maquinaria',
    ritmoCardiaco: 75,
    temperatura: 37.1,
    bateria: 78,
    estado: 'Alerta',
  },
  {
    id: 4,
    trabajador: 'Ana Martínez',
    area: 'Escaleras Sector B',
    ritmoCardiaco: 82,
    temperatura: 36.9,
    bateria: 65,
    estado: 'Activo',
  },
  {
    id: 5,
    trabajador: 'Roberto Silva',
    area: 'Ventilación Norte',
    ritmoCardiaco: 90,
    temperatura: 37.3,
    bateria: 45,
    estado: 'Crítico',
  },
  {
    id: 6,
    trabajador: 'Luis Torres',
    area: 'Zona de Carga',
    ritmoCardiaco: 70,
    temperatura: 36.7,
    bateria: 88,
    estado: 'Activo',
  },
  {
    id: 7,
    trabajador: 'Sofia Ramírez',
    area: 'Túnel Secundario',
    ritmoCardiaco: 65,
    temperatura: 36.4,
    bateria: 73,
    estado: 'Descanso',
  },
  {
    id: 8,
    trabajador: 'Diego Morales',
    area: 'Plataforma Sur',
    ritmoCardiaco: 78,
    temperatura: 36.6,
    bateria: 91,
    estado: 'Activo',
  },
];

@Component({
  selector: 'app-active-workers',
  templateUrl: './active-workers.component.html',
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
export class AppActiveWorkersComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  displayedColumns: string[] = [
    'trabajador',
    'area',
    'ritmoCardiaco',
    'temperatura',
    'bateria',
    'estado',
    'acciones',
  ];
  dataSource = new MatTableDataSource(workers);
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
    const dialogRef = this.dialog.open(AppActiveWorkersDialogContentComponent, {
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
  addRowData(row_obj: Worker): void {
    this.dataSource.data.unshift({
      id: workers.length + 1,
      trabajador: row_obj.trabajador,
      area: row_obj.area,
      ritmoCardiaco: row_obj.ritmoCardiaco,
      temperatura: row_obj.temperatura,
      bateria: row_obj.bateria,
      estado: row_obj.estado,
    });
    this.dialog.open(AppAddKichenSinkComponent);
    this.table.renderRows();
  }

  // tslint:disable-next-line - Disables all
  updateRowData(row_obj: Worker): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      if (value.id === row_obj.id) {
        value.trabajador = row_obj.trabajador;
        value.area = row_obj.area;
        value.ritmoCardiaco = row_obj.ritmoCardiaco;
        value.temperatura = row_obj.temperatura;
        value.bateria = row_obj.bateria;
        value.estado = row_obj.estado;
      }
      return true;
    });
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: Worker): boolean | any {
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
  templateUrl: 'active-workers-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppActiveWorkersDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';
  
  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppActiveWorkersDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Worker
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

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      // this.msg = 'You must select an image';
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.msg = "Only images are supported";
      return;
    }
    // tslint:disable-next-line - Disables all
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    // tslint:disable-next-line - Disables all
    reader.onload = (_event) => {
      // tslint:disable-next-line - Disables all
      this.local_data.imagePath = reader.result;
    };
  }
}

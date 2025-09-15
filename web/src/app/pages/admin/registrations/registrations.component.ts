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
import { AppAddRegistrationsComponent } from './add/add.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { RegistrationsService } from './registrations.service';

export interface Registration {
  id: number;
  userId: number;
  courseId: number;
  enrolmentDate: string;
}

@Component({
  templateUrl: './registrations.component.html',
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
export class AppRegistrationsComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    '#',
    'userId',
    'courseId',
    'enrolmentDate',
    'action',
  ];
  dataSource = new MatTableDataSource<Registration>([]);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private registrationsService: RegistrationsService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadRegistrations();
  }

  loadRegistrations(): void {
    this.registrationsService.getAll().subscribe({
      next: (registrations) => {
        this.dataSource.data = registrations;
      },
      error: (err) => {
        console.error('Error al obtener inscripciones:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppKichenSinkDialogContentComponent, {
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

  addRowData(row_obj: Registration): void {
    const currentData = this.dataSource.data;
    this.dataSource.data = [row_obj, ...currentData];
    this.dialog.open(AppAddRegistrationsComponent);
    this.table.renderRows();
  }

  updateRowData(row_obj: Registration): void {
    this.registrationsService.update(row_obj).subscribe({
      next: (res) => {
        // Actualizar la tabla local con el objeto actualizado
        this.dataSource.data = this.dataSource.data.map((registration) =>
          registration.id === res.id ? res : registration
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al actualizar publicación:', err);
      },
    });
  }

  deleteRowData(row_obj: Registration): void {
    this.registrationsService.delete(row_obj.id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(
          (registration) => registration.id !== row_obj.id
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al eliminar publicación:', err);
      },
    });
  }
}

@Component({
  selector: 'app-dialog-content',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MaterialModule, TablerIconsModule],
  providers: [DatePipe],
  templateUrl: 'registrations-dialog-content.html',
})
export class AppKichenSinkDialogContentComponent {
  action: string;
  local_data: any;
  selectedImage: any = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppKichenSinkDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Registration,
    private registrationsService: RegistrationsService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;

    if (this.local_data.imagePath === undefined) {
      this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
    }
  }

  doAction(): void {
    if (this.action === 'Add') {
      const payload = {
        userId: this.local_data.userId,
        courseId: this.local_data.courseId,
        enrolmentDate: this.local_data.enrolmentDate,
      };

      this.registrationsService
        .create(payload.userId, payload.courseId)
        .subscribe({
          next: (res) => {
            this.dialogRef.close({ event: this.action, data: res });
          },
          error: (err) => {
            console.error('Error al crear inscripción:', err);
          },
        });
    } else {
      this.dialogRef.close({ event: this.action, data: this.local_data });
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectFile(event: any): void {
    if (!event.target.files[0]) return;
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) return;

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.local_data.imagePath = reader.result;
    };
  }
}

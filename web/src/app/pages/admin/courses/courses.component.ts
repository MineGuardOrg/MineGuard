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
import { AppAddCoursesComponent } from './add/add.component';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CoursesService } from './courses.service';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';

export interface Category {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  teacherId: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  createdDate: string;
  instructorName: string;
  imgUrl: string;
  categories: Category[];
}

@Component({
  templateUrl: './courses.component.html',
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
export class AppCoursesComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    '#',
    'title',
    'description',
    'teacherId',
    'categories',
    'level',
    'imgUrl',
    'action',
  ];

  dataSource = new MatTableDataSource<Course>([]);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private coursesService: CoursesService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = 5;
    this.loadCourses();
  }

  loadCourses(): void {
    this.coursesService.getAll().subscribe({
      next: (courses) => {
        this.dataSource.data = courses;
      },
      error: (err) => {
        console.error('Error al obtener cursos:', err);
      },
    });
  }

  getCategoryNames(categories: Category[]): string {
    if (!categories) return '';
    return categories.map((c) => c.name).join(', ');
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
      if (!result) return;

      if (result.event === 'Add') {
        this.addRowData(result.data);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj: Course): void {
    const currentData = this.dataSource.data;
    this.dataSource.data = [row_obj, ...currentData];
    this.dialog.open(AppAddCoursesComponent);
    this.table.renderRows();
  }

  updateRowData(row_obj: Course): void {
    this.coursesService.update(row_obj).subscribe({
      next: (res) => {
        // Actualizar la tabla local con el objeto actualizado
        this.dataSource.data = this.dataSource.data.map((course) =>
          course.id === res.id ? res : course
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al actualizar curso:', err);
      },
    });
  }

  deleteRowData(row_obj: Course): void {
    this.coursesService.delete(row_obj.id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(
          (course) => course.id !== row_obj.id
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al eliminar curso:', err);
      },
    });
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MaterialModule, TablerIconsModule, CommonModule],
  providers: [DatePipe],
  templateUrl: 'courses-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppKichenSinkDialogContentComponent {
  action: string;
  local_data: any;
  selectedImage: any = '';
  categories: Category[] = [];

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppKichenSinkDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Course,
    private coursesService: CoursesService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    if (this.local_data.imagePath === undefined) {
      this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
    }
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token') || '';
    this.coursesService.getCategories(token).subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err) => {
        console.error('Error al obtener categorías:', err);
      },
    });
  }

doAction(): void {
  if (this.action === 'Add' || this.action === 'Update') {
    const payload = {
      id: this.local_data.id,
      title: this.local_data.title,
      description: this.local_data.description,
      level: this.local_data.level,
      cost: Number(this.local_data.cost),
      imgUrl: this.local_data.imgurl,
      teacherId: Number(this.local_data.teacherId),
      categories: this.local_data.selectedCategoryIds.map((id: number) => ({
        id,
      })),
    };

    const request = this.action === 'Add'
      ? this.coursesService.create(payload)
      : this.coursesService.update(payload);

    request.subscribe({
      next: (res) => {
        this.dialogRef.close({ event: this.action, data: res });
      },
      error: (err) => {
        console.error(`Error al ${this.action === 'Add' ? 'crear' : 'actualizar'} curso:`, err);
      },
    });
  } else if (this.action === 'Delete') {
    this.coursesService.delete(this.local_data.id).subscribe({
      next: () => {
        this.dialogRef.close({ event: this.action, data: this.local_data });
      },
      error: (err) => {
        console.error('Error al eliminar curso:', err);
      },
    });
  }
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

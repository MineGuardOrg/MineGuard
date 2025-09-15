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
import { AppAddLessonsComponent } from './add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { LessonsService } from './lessons.service';

export interface LessonResource {
  id: number;
  fileName: string;
  fileUrl: string;
  lessonId: number;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  courseTitle: string;
  order: number;
  lessonCourseId: number;
  resources: LessonResource[];
}

@Component({
  templateUrl: './lessons.component.html',
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
export class AppLessonsComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    '#',
    'title',
    'description',
    'courseTitle',
    'order',
    'lessonCourseId',
    'resources',
    'action',
  ];

  dataSource = new MatTableDataSource<Lesson>([]);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private lessonsService: LessonsService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadLessons();
  }

  loadLessons(): void {
    this.lessonsService.getAll().subscribe({
      next: (lessons) => {
        this.dataSource.data = lessons;
      },
      error: (err) => {
        console.error('Error al obtener lecciones:', err);
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

  // tslint:disable-next-line - Disables all
  addRowData(row_obj: Lesson): void {
    const currentData = this.dataSource.data;
    this.dataSource.data = [row_obj, ...currentData];
    this.dialog.open(AppAddLessonsComponent);
    this.table.renderRows();
  }

  // tslint:disable-next-line - Disables all
  updateRowData(row_obj: Lesson): void {
    this.lessonsService.update(row_obj).subscribe({
      next: (res) => {
        // Actualizar la tabla local con el objeto actualizado
        this.dataSource.data = this.dataSource.data.map((lesson) =>
          lesson.id === res.id ? res : lesson
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al actualizar publicación:', err);
      },
    });
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: Lesson): void {
    this.lessonsService.delete(row_obj.id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(
          (lesson) => lesson.id !== row_obj.id
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
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MaterialModule,
    TablerIconsModule,
  ],
  providers: [DatePipe],
  templateUrl: 'lessons-dialog-content.html',
})

// tslint:disable-next-line: component-class-suffix
export class AppKichenSinkDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppKichenSinkDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Lesson,
    private lessonsService: LessonsService // <-- Esto debe estar
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    // if (this.local_data.RegisterDate !== undefined) {
    //   this.joiningDate = this.datePipe.transform(
    //     new Date(this.local_data.RegisterDate),
    //     'yyyy-MM-dd'
    //   );
    // }
    if (this.local_data.imagePath === undefined) {
      this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
    }
  }

  doAction(): void {
    if (this.action === 'Add') {
      const payload = {
        title: this.local_data.title,
        description: this.local_data.description,
        videoUrl: this.local_data.videoUrl,
        courseId: this.local_data.courseId, 
        order: this.local_data.order,
        lessonCourseId: this.local_data.lessonCourseId,
      };

      this.lessonsService.create(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al crear lección:', err);
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

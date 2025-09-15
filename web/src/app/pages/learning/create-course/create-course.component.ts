import { Component, Inject, Optional, AfterViewInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CoursesService } from './create-course.service';
import { FormsModule } from '@angular/forms';

export interface Course {
  id: number;
  title: string;
  description: string;
  teacherId: number;
  categoryId: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  cost: number;
  imgUrl: string;
}

@Component({
  templateUrl: './create-course.component.html',
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
export class AppCreateCourseComponent implements AfterViewInit {
  dataSource: Course[] = [];

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private coursesService: CoursesService
  ) {}

  ngAfterViewInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.coursesService.getCoursesByUserId().subscribe({
      next: (courses) => {
        this.dataSource = courses;
      },
      error: (err) => {
        console.error('Error al obtener cursos por usuario:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    if (!filterValue) {
      this.loadCourses();
      return;
    }
    const lowerFilter = filterValue.trim().toLowerCase();
    this.dataSource = this.dataSource.filter(
      (course) =>
        course.title.toLowerCase().includes(lowerFilter) ||
        course.description.toLowerCase().includes(lowerFilter)
    );
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
    this.dataSource = [row_obj, ...this.dataSource];
  }

  updateRowData(row_obj: Course): void {
    this.coursesService.update(row_obj).subscribe({
      next: (res) => {
        this.dataSource = this.dataSource.map((course) =>
          course.id === res.id ? res : course
        );
      },
      error: (err) => {
        console.error('Error al actualizar curso:', err);
      },
    });
  }

  deleteRowData(row_obj: Course): void {
    this.coursesService.delete(row_obj.id).subscribe({
      next: () => {
        this.dataSource = this.dataSource.filter(
          (course) => course.id !== row_obj.id
        );
      },
      error: (err) => {
        console.error('Error al eliminar curso:', err);
      },
    });
  }
}

@Component({
  selector: 'app-dialog-content',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MaterialModule, TablerIconsModule],
  providers: [DatePipe],
  templateUrl: 'create-course-dialog-content.html',
})
export class AppKichenSinkDialogContentComponent {
  action: string;
  local_data: any;
  selectedImage: any = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppKichenSinkDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Course,
    private coursesService: CoursesService
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
      title: this.local_data.title,
      description: this.local_data.description,
      level: this.local_data.level,
      cost: Number(this.local_data.cost),
      imgUrl: this.local_data.imgurl,
      categories: [
        {
          id: Number(this.local_data.categoryId),
          name: this.local_data.categoryName || ''
        }
      ]
    };

    this.coursesService.create(payload).subscribe({
      next: (res) => {
        this.dialogRef.close({ event: this.action, data: res });
      },
      error: (err) => {
        console.error('Error al crear curso:', err);
      },
    });
  } else if (this.action === 'Update') {
    const payload = {
      id: this.local_data.id,
      title: this.local_data.title,
      description: this.local_data.description,
      level: this.local_data.level,
      cost: Number(this.local_data.cost),
      imgUrl: this.local_data.imgurl,
      categories: [
        {
          id: Number(this.local_data.categoryId),
          name: this.local_data.categoryName || ''
        }
      ]
    };

    this.coursesService.update(payload).subscribe({
      next: (res) => {
        this.dialogRef.close({ event: this.action, data: res });
      },
      error: (err) => {
        console.error('Error al actualizar curso:', err);
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
}

import { Component, OnInit } from '@angular/core';
import { CourseService } from './course.service';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Course } from './course';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    TablerIconsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    CommonModule
  ],
})
export class AppCoursesComponent implements OnInit {
  allCourses: Course[] = [];    // Todos los cursos obtenidos
  courseList: Course[] = [];    // Cursos filtrados y mostrados
  selectedCategory = 'All';

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAll().subscribe({
      next: (data: Course[]) => {
        this.allCourses = data ?? [];  // Seguridad por si la API responde null
        this.courseList = [...this.allCourses];
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.allCourses = [];
        this.courseList = [];
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    // Filtrar por texto (título)
    let filtered = this.allCourses.filter(course =>
      course.title.toLowerCase().includes(filterValue)
    );

    // Si hay categoría seleccionada distinta de 'All', filtrar también por categoría
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(course => course.category === this.selectedCategory);
    }

    this.courseList = filtered;
  }

  ddlChange(event: any): void {
    this.selectedCategory = event.value;

    // Si es 'All', mostrar todo, sino filtrar por categoría
    if (this.selectedCategory === 'All') {
      this.courseList = [...this.allCourses];
    } else {
      this.courseList = this.allCourses.filter(course =>
        course.category === this.selectedCategory
      );
    }
  }

  trackByCourseId(index: number, course: Course): number {
    return course.id;
  }
}

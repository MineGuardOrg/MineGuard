import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CourseService } from './courses.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Course } from './course';

export interface CourseViewModel {
  id: number;
  title: string;
  imgUrl: string;
  teacherName: string;
  date: string;
  category: string;
  averageRating: number;
  reviewCount: number;
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    TablerIconsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    RouterModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class AppCoursesComponent implements OnInit {
  allCourses: CourseViewModel[] = [];
  courseList: CourseViewModel[] = [];
  selectedCategory = 'All';
  Math = Math;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAll().subscribe({
      next: (data) => {
        this.allCourses = data.map((course: any) => ({
          id: course.id,
          title: course.title,
          imgUrl:
            course.imgUrl && course.imgUrl.trim() !== ''
              ? course.imgUrl
              : '/assets/images/courses/course-default.webp',
          teacherName: course.teacherName || 'Instructor Desconocido',
          date: course.createdDate
            ? new Date(course.createdDate).toLocaleDateString()
            : '',
          category: course.categories || 'General',
          reviewCount: course.stats?.counter || 0,
          averageRating: course.stats?.average || 0,
        }));
        this.courseList = [...this.allCourses];
      },
      error: (err) => {
        console.error('Error al cargar cursos', err);
      },
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

  trackByimgUrl(index: number, course: CourseViewModel): string {
    return course.imgUrl;
  }

  getFilledStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.round(rating)).fill(0);
  }

  DetailCourses(id: number) {
    this.router.navigate(['/learning/courses/details', id]);
  }
}

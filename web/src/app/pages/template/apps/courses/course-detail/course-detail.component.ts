import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CourseService } from '../course.service';
import { Course } from '../course';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  standalone: true,
  imports: [MatCardModule, TablerIconsModule, MatStepperModule, MatInputModule, MatButtonModule, RouterModule, CommonModule],
  styleUrls: ['./course-detail.component.scss'],
})
export class AppCourseDetailComponent implements OnInit {
  id: number | null = null;
  courseDetail: Course | undefined;

  constructor(private activatedRoute: ActivatedRoute, private courseService: CourseService) {}

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (this.id) {
      // Cargar todos los cursos y luego filtrar por id
      this.courseService.getAll().subscribe({
        next: (courses: Course[]) => {
          this.courseDetail = courses.find(c => c.id === this.id);
        },
        error: (err) => {
          console.error('Error loading course detail:', err);
          this.courseDetail = undefined;
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatIconModule } from '@angular/material/icon';
import { Course } from '../course';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CourseService } from '../courses.service';
import { CourseDetailService } from './courses.details.service';

@Component({
  selector: 'app-courses-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TablerIconsModule,
    RouterModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './courses-details.component.html',
  styleUrls: ['./courses-details.component.scss'],
})
export class CoursesDetailsComponent implements OnInit {
  id: number | null = null;
  courseDetail: Course | undefined;
  isSubscribed: boolean = false;
  istoggleReply: boolean = true;
  activeRoute: any = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private courseDetailService: CourseDetailService, // Nuevo servicio
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.activeRoute = this.router.url.split('/').pop();

    if (this.id) {
      this.courseService.getAll().subscribe({
        next: (courses: Course[]) => {
          this.courseDetail = courses.find((c) => c.id === this.id);
        },
        error: (err) => {
          console.error('Error loading course detail:', err);
          this.courseDetail = undefined;
        },
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  toggleReply(): void {
    this.istoggleReply = !this.istoggleReply;
  }

  enroll(): void {
    const userId = this.getUserIdFromToken();
    const courseId = this.id;

    if (!userId || !courseId) {
      alert('No se pudo obtener el ID del usuario o del curso.');
      return;
    }

    this.courseDetailService.enrollToCourse(userId, courseId).subscribe({
      next: () => {
        alert('Inscripción exitosa');
        this.isSubscribed = true;
      },
      error: (error) => {
        console.error('Error al inscribirse:', error);
        alert('Error al inscribirse');
      },
    });
  }

  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id ? Number(payload.id) : null;
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  getCategoryNames(): string {
  if (!this.courseDetail?.categories || this.courseDetail.categories.length === 0) {
    return 'General';
  }
  // Devuelve solo los nombres de las categorías, separados por coma
  return this.courseDetail.categories.map(c => c.name).join(', ');
}
}

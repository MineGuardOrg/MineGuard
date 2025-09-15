import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatIconModule } from '@angular/material/icon';
import { MyCoursesService } from '../my-courses.service';
import { Course, LessonDto } from '../course';
import { RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Location } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

interface FlattenedStep {
  moduleTitle: string;
  lesson: LessonDto;
  stepIndex: number;
}

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TablerIconsModule,
    RouterModule,
    MatStepperModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
  ],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  id: number | null = null;

  courseDetail: Course = {
    id: 0,
    title: '',
    description: '',
    instructorName: '',
    level: '',
    cost: 0,
    imgUrl: null,
    createdDate: '',
    categories: [],
    lessonCourseDtos: [],
  };

  flattenedSteps: FlattenedStep[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: MyCoursesService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    if (this.id) {
      this.courseService.getCourseDetails(this.id).subscribe({
        next: (data: Course) => {
          this.courseDetail = data;
          console.log('Detalle completo del curso:', data);

          // Aplanar los pasos de las lecciones
          this.flattenedSteps = [];
          let stepCounter = 0;

          if (data.lessonCourseDtos && data.lessonCourseDtos.length > 0) {
            for (const module of data.lessonCourseDtos) {
              if (module.lessonDtos && module.lessonDtos.length > 0) {
                for (const lesson of module.lessonDtos) {
                  this.flattenedSteps.push({
                    moduleTitle: module.title || 'Sin título módulo',
                    lesson: lesson,
                    stepIndex: stepCounter,
                  });
                  stepCounter++;
                }
              }
            }
          }

          console.log('Pasos aplanados:', this.flattenedSteps);
        },
        error: (err) => {
          console.error('Error al obtener los detalles del curso:', err);
        },
      });
    }
  }

  isVideo(fileUrl?: string): boolean {
  if (!fileUrl) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg'];
  return videoExtensions.some(ext => fileUrl.toLowerCase().includes(ext));
}

  goBack(): void {
    this.location.back();
  }
}

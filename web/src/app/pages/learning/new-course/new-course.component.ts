import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { NewCourseService } from '../new-course/new-course.service';
import { LessonCourseService } from '../new-course/new-course.service';
import { LessonService } from '../new-course/new-course.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AppAddCourseComponent } from './add/add.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-new-course',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    TablerIconsModule,
    NgxMatFileInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-course.component.html',
  styleUrl: './new-course.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class AppNewCourseComponent implements OnInit {
  firstFormGroup = this._formBuilder.group({
    title: ['', Validators.required],
    imgUrl: ['', Validators.required],
    description: ['', Validators.required],
    level: ['', Validators.required],
    cost: [0, [Validators.required, Validators.min(0)]],
    categoryId: [[], Validators.required],
  });

  secondFormGroup = this._formBuilder.group({
    order: ['', Validators.required],
    lessonTitle: ['', Validators.required], // este va a lessoncourse/create
    chapterTitle: ['', Validators.required], // si quieres usarlo, o descártalo
    description: ['', Validators.required],
    videoUrl: ['', Validators.required],
  });

  fileControl = new FormControl(null, Validators.required);

  categories: { id: number; name: string }[] = [];
  termsAccepted: any;

  constructor(
    private _formBuilder: FormBuilder,
    private newCourseService: NewCourseService,
    private authService: AuthService,
    private lessonCourseService: LessonCourseService,
    private lessonService: LessonService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No se encontró un token de autenticación.');
      return;
    }

    this.newCourseService.getCategories(token).subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error al obtener categorías:', err);
      },
    });
  }

  finish() {
    console.log('firstFormGroup valid:', this.firstFormGroup.valid);
    console.log('firstFormGroup values:', this.firstFormGroup.value);
    console.log('secondFormGroup valid:', this.secondFormGroup.valid);
    console.log('secondFormGroup values:', this.secondFormGroup.value);

    if (this.firstFormGroup.invalid || this.secondFormGroup.invalid) {
      console.warn('Formulario incompleto o inválido');
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      console.error('No hay token de autenticación');
      return;
    }

    const coursePayload = {
      title: this.firstFormGroup.value.title,
      description: this.firstFormGroup.value.description,
      level: this.firstFormGroup.value.level,
      cost: this.firstFormGroup.value.cost,
      imgUrl: this.firstFormGroup.value.imgUrl,
      categories: (this.firstFormGroup.value.categoryId ?? []).map(
        (id: number) => ({ id, name: '' })
      ),
    };

    console.log('Enviando datos para crear el curso:', coursePayload);

    this.newCourseService.create(coursePayload, token).subscribe({
      next: (courseRes) => {
        const createdCourseId = courseRes.id;
        console.log('Curso creado con ID:', createdCourseId);

        const lessonCoursePayload = {
          title: this.secondFormGroup.value.lessonTitle,
          courseId: createdCourseId,
        };

        console.log(
          'Enviando datos para crear lessonCourse:',
          lessonCoursePayload
        );

        this.lessonCourseService
          .createLessonCourse(lessonCoursePayload, token)
          .subscribe({
            next: (lessonCourseRes) => {
              const lessonCourseId = lessonCourseRes.id;
              console.log('LessonCourse creado con ID:', lessonCourseId);

              const lessonPayload = {
                title: this.secondFormGroup.value.chapterTitle,
                description: this.secondFormGroup.value.description,
                videoUrl: this.secondFormGroup.value.videoUrl,
                courseId: createdCourseId,
                order: Number(this.secondFormGroup.value.order),
                lessonCourseId: lessonCourseId, // Asegurate que este campo se llame igual en el backend
              };

              console.log('Enviando datos para crear lesson:', lessonPayload);

              this.lessonService.createLesson(lessonPayload, token).subscribe({
                next: (lessonRes) => {
                  console.log(
                    '¡Curso y lección creados exitosamente!',
                    lessonRes
                  );
                  // Mostrar el dialogo de exito
                  this.dialog.open(AppAddCourseComponent, {
                    disableClose: true,
                  });
                },
                error: (lessonErr) => {
                  console.error('Error al crear la lección:', lessonErr);
                },
              });
            },
            error: (lessonCourseErr) => {
              console.error('Error al crear lessonCourse:', lessonCourseErr);
            },
          });
      },
      error: (courseErr) => {
        console.error('Error al crear el curso:', courseErr);
      },
    });
  }
}

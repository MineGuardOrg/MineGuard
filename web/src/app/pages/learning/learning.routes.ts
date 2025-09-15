import { Routes } from '@angular/router';
import { AppCoursesComponent } from './courses/courses.component';
import { AppMyCoursesComponent } from './my-courses/my-courses.component';
import { AppCertificatesComponent } from './certificates/certificates.component';
import { AppForumComponent } from './forum/forum.component';
import { AppForumDetailsComponent } from './forum/details/details.component';
import { AppFaqsComponent } from './faqs/faqs.component';
import { AppAccountSettingsComponent } from './account-settings/account-settings.component';
import { AppCreateCourseComponent } from './create-course/create-course.component';
import { DetailComponent } from './my-courses/detail/detail.component';
import { CoursesDetailsComponent } from './courses/courses-details/courses-details.component';
import { AppTestComponent } from './test/test.component';
import { AppNewCourseComponent } from './new-course/new-course.component';

export const LearningRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'courses',
        component: AppCoursesComponent,
        data: {
          title: 'Courses',
        },
      },
      {
        path: 'courses/details/:id',
        component: CoursesDetailsComponent,
        data: {
          title: 'Courses details'
        },
      },
      {
        path: 'my-courses',
        component: AppMyCoursesComponent,
        data: {
          title: 'My Courses',
        },
      },
      {
        path: 'my-courses/details/:id',
        component: DetailComponent,
        title: 'My courses details'
      },
      {
        path: 'certificates',
        component: AppCertificatesComponent,
        data: {
          title: 'Certificates',
        },
      },
      {
        path: 'forum',
        component: AppForumComponent,
        data: {
          title: 'Forum',
        },
      },
      {
        path: 'forum/details/:id',
        component: AppForumDetailsComponent,
        data: {
          title: 'Post Details',
        },
      },
      {
        path: 'faqs',
        component: AppFaqsComponent,
        data: {
          title: 'FAQs',
        },
      },
      {
        path: 'create-course',
        component: AppCreateCourseComponent,
        data: {
          title: 'Create a Course',
        },
      },
      {
        path: 'new-course',
        component: AppNewCourseComponent,
        data: {
          title: 'Add a Course',
        },
      },
      {
        path: 'test',
        component: AppTestComponent,
        data: {
          title: 'test',
        },
      },
      {
        path: 'account-settings',
        component: AppAccountSettingsComponent,
        data: {
          title: 'Account Settings',
        },
      },
    ],
  },
];

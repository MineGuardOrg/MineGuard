import { Routes } from '@angular/router';

// dashboards
import { AppUsersComponent } from './users/users.component';
import { AppRolesComponent } from './roles/roles.component';
import { AppCategoriesComponent } from './categories/categories.component';
import { AppLessonCommentsComponent } from './lessonsComments/lessonsComments.component';
import { AppPostsComponent } from './posts/posts.component';
import { AppPostsCommentsComponent } from './postsComments/postsComments.component';
import { AppQuizesComponent } from './quizes/quizes.component';
import { AppQuizesQuestionsComponent } from './quizesQuestions/quizesQuestions.component';
import { AppRegistrationsComponent } from './registrations/registrations.component';
import { AppResourcesComponent } from './resources/resources.component';
import { AppReviewsComponent } from './reviews/reviews.component';
import { AppUsersAnswersComponent } from './usersAnswers/usersAnswers.component';
import { AppFaqsComponent } from './faqs/faqs.component';
import { AppCertificateComponent } from './certificates/certificate.component';
import { AppLessonsComponent } from './lessons/lessons.component';
import { AppCoursesComponent } from './courses/courses.component';
import { LessonsProgressComponent } from './lessons-progress/lessons-progress.component';
import { AppMessagesComponent } from './messages/messages.component';
import { AppDashboard1Component } from './dashboard1/dashboard1.component';
import { AppDashboard2Component } from './dashboard2/dashboard2.component';
import { AppDashboard3Component } from './dashboard3/dashboard3.component';
import { AppDatabaseMaintenanceComponent } from './database-maintenance/database-maintenance.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'maintenance',
        component: AppDatabaseMaintenanceComponent,
        data: {
          title: 'Maintenance',
        },
      },
      {
        path: 'certificate',
        component: AppCertificateComponent,
        data: {
          title: 'Certificates',
        },
      },
      {
        path: 'courses',
        component: AppCoursesComponent,
        data: {
          title: 'Courses',
        },
      },
      {
        path: 'lessons',
        component: AppLessonsComponent,
        data: {
          title: 'Lessons',
        },
      },
      {
        path: 'users',
        component: AppUsersComponent,
        data: {
          title: 'Users',
        },
      },
      {
        path: 'roles',
        component: AppRolesComponent,
        data: {
          title: 'Roles',
        },
      },
      {
        path: 'categories',
        component: AppCategoriesComponent,
        data: {
          title: 'Categories',
        },
      },
      {
        path: 'lessonsComments',
        component: AppLessonCommentsComponent,
        data: {
          title: 'Lessons Comments',
        },
      },
      {
        path: 'posts',
        component: AppPostsComponent,
        data: {
          title: 'Posts',
        },
      },
      {
        path: 'postsComments',
        component: AppPostsCommentsComponent,
        data: {
          title: 'Posts Comments',
        },
      },
      {
        path: 'quizes',
        component: AppQuizesComponent,
        data: {
          title: 'Quizes',
        },
      },
      {
        path: 'quizesQuestions',
        component: AppQuizesQuestionsComponent,
        data: {
          title: 'Quizes Questions',
        },
      },
      {
        path: 'registrations',
        component: AppRegistrationsComponent,
        data: {
          title: 'Registrations',
        },
      },
      {
        path: 'resources',
        component: AppResourcesComponent,
        data: {
          title: 'Resources',
        },
      },
      {
        path: 'reviews',
        component: AppReviewsComponent,
        data: {
          title: 'Reviews',
        },
      },
      {
        path: 'usersAnswers',
        component: AppUsersAnswersComponent,
        data: {
          title: 'Users Answers',
        },
      },
      {
        path: 'lessons-progress',
        component: LessonsProgressComponent,
        data: {
          title: 'Lessons Progress',
        },
      },
      {
        path: 'messages',
        component: AppMessagesComponent,
        data: {
          title: 'Messages',
        },
      },
      {
        path: 'faqs',
        component: AppFaqsComponent,
        data: {
          title: 'Faqs',
        },
      },
      {
        path: 'dashboard1',
        component: AppDashboard1Component,
        data: {
          title: 'Dashboard 1',
        },
      },
      {
        path: 'dashboard2',
        component: AppDashboard2Component,
        data: {
          title: 'Dashboard 2',
        },
      },
      {
        path: 'dashboard3',
        component: AppDashboard3Component,
        data: {
          title: 'Dashboard 3',
        },
      },
    ],
  },
];

import { Routes } from '@angular/router';

// theme pages
import { AppEmploymentComponent } from './employment.component';

export const EmploymentRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AppEmploymentComponent,
      },
    ],
  },
];

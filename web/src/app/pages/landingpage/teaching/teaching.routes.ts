import { Routes } from '@angular/router';

// theme pages
import { AppTeachingComponent } from './teaching.component';

export const TeachingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AppTeachingComponent,
      },
    ],
  },
];

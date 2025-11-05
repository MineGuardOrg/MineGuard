import { Routes } from '@angular/router';

// dashboards
import { AppDashboardComponent } from './dashboard/dashboard.component';

export const MainRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: AppDashboardComponent,
        data: {
          title: 'Dashboard',
        },
      },
    ],
  },
];

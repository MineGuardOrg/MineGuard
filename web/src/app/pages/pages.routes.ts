import { Routes } from '@angular/router';
import { StarterComponent } from './template/starter/starter.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Starter',
      urls: [
        { title: 'Dashboard', url: '/starter' },
        { title: 'Starter' },
      ],
    },
  },
];

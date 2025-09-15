import { Routes } from '@angular/router';

// theme pages
import { AppPrivacyComponent } from './privacy.component';

export const PrivacyRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AppPrivacyComponent,
      },
    ],
  },
];

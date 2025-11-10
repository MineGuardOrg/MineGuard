import { Routes } from '@angular/router';

// theme pages
import { AppAboutusComponent } from './aboutus.component';

export const AboutUsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AppAboutusComponent,
      },
    ],
  },
];
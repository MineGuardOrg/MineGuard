import { Routes } from '@angular/router';

// theme pages
import { AppLandingpageComponent } from './landingpage.component';

export const LandingPageRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AppLandingpageComponent,
      },
      {
        path: 'aboutus',
        loadChildren: () => import('./aboutus/aboutus.routes').then(m => m.AboutUsRoutes)
      },
    ],
  },
  
];

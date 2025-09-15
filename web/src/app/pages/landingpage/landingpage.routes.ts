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
        path: 'teaching',
        loadChildren: () => import('./teaching/teaching.routes').then(m => m.TeachingRoutes)
      },
      {
        path: 'aboutus',
        loadChildren: () => import('./aboutus/aboutus.routes').then(m => m.AboutUsRoutes)
      },
      {
        path: 'help',
        loadChildren: () => import('./help/help.routes').then(m => m.HelpRoutes)
      },
      {
        path: 'privacy',
        loadChildren: () => import('./privacy/privacy.routes').then(m => m.PrivacyRoutes)
      },
      {
        path: 'employment',
        loadChildren: () => import('./employment/employment.routes').then(m => m.EmploymentRoutes)
      },
    ],
  },
  
];

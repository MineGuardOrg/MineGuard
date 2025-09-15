import { Routes } from '@angular/router';

// theme pages
import { AppHelpComponent } from './help.component';

export const HelpRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AppHelpComponent,
      },
    ],
  },
];

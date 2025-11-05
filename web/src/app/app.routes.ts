import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/landingpage',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'starter',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./pages/admin/admin.routes').then((m) => m.AdminRoutes),
      },
      {
        path: 'main',
        loadChildren: () =>
          import('./pages/main/main.routes').then((m) => m.MainRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/template/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./pages/template/forms/forms.routes').then((m) => m.FormsRoutes),
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./pages/template/charts/charts.routes').then((m) => m.ChartsRoutes),
      },
      {
        path: 'apps',
        loadChildren: () =>
          import('./pages/template/apps/apps.routes').then((m) => m.AppsRoutes),
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./pages/template/widgets/widgets.routes').then((m) => m.WidgetsRoutes),
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./pages/template/tables/tables.routes').then((m) => m.TablesRoutes),
      },
      {
        path: 'datatable',
        loadChildren: () =>
          import('./pages/template/datatable/datatable.routes').then(
            (m) => m.DatatablesRoutes
          ),
      },
      {
        path: 'theme-pages',
        loadChildren: () =>
          import('./pages/template/theme-pages/theme-pages.routes').then(
            (m) => m.ThemePagesRoutes
          ),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./pages/auth/auth.routes').then((m) => m.AuthRoutes),
      },
      {
        path: 'landingpage',
        loadChildren: () =>
          import('./pages/landingpage/landingpage.routes').then(
            (m) => m.LandingPageRoutes
          ),
      },
      {
        path: 'teaching',
        loadChildren: () =>
          import('./pages/landingpage/teaching/teaching.routes').then(
            (m) => m.TeachingRoutes
          ),
      },
      {
        path: 'aboutus',
        loadChildren: () =>
          import('./pages/landingpage/aboutus/aboutus.routes').then(
            (m) => m.AboutUsRoutes
          ),
      },
      {
        path: 'help',
        loadChildren: () =>
          import('./pages/landingpage/help/help.routes').then(
            (m) => m.HelpRoutes
          ),
      },
      {
        path: 'privacy',
        loadChildren: () =>
          import('./pages/landingpage/privacy/privacy.routes').then(
            (m) => m.PrivacyRoutes
          ),
      },
      {
        path: 'employment',
        loadChildren: () =>
          import('./pages/landingpage/employment/employment.routes').then(
            (m) => m.EmploymentRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];

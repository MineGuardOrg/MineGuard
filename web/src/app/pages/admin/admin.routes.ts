import { Routes } from '@angular/router';

// dashboards
import { AppAlertsComponent } from './alerts/alerts.component';
import { AppAreasComponent } from './areas/areas.component';
import { AppDashboard1Component } from './dashboard1/dashboard1.component';
import { AppDashboard2Component } from './dashboard2/dashboard2.component';
import { AppDashboard3Component } from './dashboard3/dashboard3.component';
import { AppDatabaseMaintenanceComponent } from './database-maintenance/database-maintenance.component';
import { AppDevicesComponent } from './devices/devices.component';
import { AppIncidentsComponent } from './incidents/incidents.component';
import { AppMaintenanceComponent } from './maintenance/maintenance.component';
import { AppPositionsComponent } from './positions/positions.component';
import { AppReadingsComponent } from './readings/readings.component';
import { AppRolesComponent } from './roles/roles.component';
import { AppSensorsComponent } from './sensors/sensors.component';
import { AppShiftsComponent } from './shifts/shifts.component';
import { AppUsersComponent } from './users/users.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'alerts',
        component: AppAlertsComponent,
        data: {
          title: 'Alerts',
        },
      },
      {
        path: 'areas',
        component: AppAreasComponent,
        data: {
          title: 'Areas',
        },
      },
      {
        path: 'dashboard1',
        component: AppDashboard1Component,
        data: {
          title: 'Dashboard 1',
        },
      },
      {
        path: 'dashboard2',
        component: AppDashboard2Component,
        data: {
          title: 'Dashboard 2',
        },
      },
      {
        path: 'dashboard3',
        component: AppDashboard3Component,
        data: {
          title: 'Dashboard 3',
        },
      },
      {
        path: 'devices',
        component: AppDevicesComponent,
        data: {
          title: 'Devices',
        },
      },
      {
        path: 'incidents',
        component: AppIncidentsComponent,
        data: {
          title: 'Incidents',
        },
      },
      {
        path: 'maintenance-logs',
        component: AppMaintenanceComponent,
        data: {
          title: 'Maintenance',
        },
      },
      {
        path: 'maintenance',
        component: AppDatabaseMaintenanceComponent,
        data: {
          title: 'Maintenance',
        },
      },
      {
        path: 'readings',
        component: AppReadingsComponent,
        data: {
          title: 'Readings',
        },
      },
      {
        path: 'positions',
        component: AppPositionsComponent,
        data: {
          title: 'Positions',
        },
      },
      {
        path: 'roles',
        component: AppRolesComponent,
        data: {
          title: 'Roles',
        },
      },
      {
        path: 'sensors',
        component: AppSensorsComponent,
        data: {
          title: 'Sensors',
        },
      },
      {
        path: 'shifts',
        component: AppShiftsComponent,
        data: {
          title: 'Shifts',
        },
      },
      {
        path: 'users',
        component: AppUsersComponent,
        data: {
          title: 'Users',
        },
      },
    ],
  },
];

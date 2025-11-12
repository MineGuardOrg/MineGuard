import { Component } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { AppTopCardsComponent } from 'src/app/components/dashboard/top-cards/top-cards.component';
import { AppAlertsByTypeComponent } from 'src/app/components/dashboard/alerts-by-type/alerts-by-type.component';
import { AppBiometricAvgComponent } from 'src/app/components/dashboard/biometric-avg/biometric-avg.component';
import { AppActiveWorkersComponent } from 'src/app/components/dashboard/active-workers/active-workers.component';
import { AppRecentAlertsComponent } from 'src/app/components/dashboard/recent-alerts/recent-alerts.component';
import { AppWorkoutByShiftComponent } from 'src/app/components/dashboard/workout-by-shift/workout-by-shift.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TablerIconsModule,
    AppTopCardsComponent,
    AppAlertsByTypeComponent,
    AppBiometricAvgComponent,
    AppActiveWorkersComponent,
    AppRecentAlertsComponent,
    AppWorkoutByShiftComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class AppDashboardComponent {
  constructor() {}
}

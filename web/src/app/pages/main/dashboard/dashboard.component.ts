import { Component } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { AppCustomersWeekComponent } from 'src/app/components/dashboard1/customers-week/customers-week.component';
import { AppCustomersComponent } from 'src/app/components/dashboard1/customers/customers.component';
import { AppProjectsComponent } from 'src/app/components/dashboard1/projects/projects.component';
import { AppRevenueProductComponent } from 'src/app/components/dashboard1/revenue-product/revenue-product.component';
import { AppSalesOverviewComponent } from 'src/app/components/dashboard1/sales-overview/sales-overview.component';
import { AppTotalSettlementsComponent } from 'src/app/components/dashboard1/total-settlements/total-settlements.component';
import { AppWelcomeCardComponent } from 'src/app/components/dashboard1/welcome-card/welcome-card.component';
import { AppYourPerformanceComponent } from 'src/app/components/dashboard1/your-performance/your-performance.component';
import { AppTopCardsComponent } from 'src/app/components/dashboard3/top-cards/top-cards.component';
import { AppColumnChartComponent } from 'src/app/components/dashboard/column-chart/column-chart.component';
import { AppAlertsByTypeComponent } from 'src/app/components/dashboard/alerts-by-type/alerts-by-type.component';
import { AppActiveWorkersComponent } from 'src/app/components/dashboard/active-workers/active-workers.component';
import { AppRecentAlertsComponent } from 'src/app/components/dashboard/recent-alerts/recent-alerts.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TablerIconsModule,
    AppCustomersComponent,
    AppWelcomeCardComponent,
    AppProjectsComponent,
    AppAlertsByTypeComponent,
    AppCustomersWeekComponent,
    AppSalesOverviewComponent,
    AppYourPerformanceComponent,
    AppTotalSettlementsComponent,
    AppRevenueProductComponent,
    AppTopCardsComponent,
    AppColumnChartComponent,
    AppActiveWorkersComponent,
    AppRecentAlertsComponent
  ],
  templateUrl: './dashboard.component.html',
})
export class AppDashboardComponent {
  constructor() {}
}

import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule, DatePipe } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { AlertsService } from './alerts.service';
import { TranslateModule } from '@ngx-translate/core';

export interface Alert {
  id: number;
  alert_type: string;
  severity: 'low' | 'medium' | 'high';
  reading_id: number;
  timestamp: string;
}

@Component({
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgScrollbarModule,
    CommonModule,
    TranslateModule,
  ],
  providers: [DatePipe],
})
export class AppAlertsComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    'id',
    'alert_type',
    'severity',
    'reading_id',
    'timestamp',
  ];
  dataSource = new MatTableDataSource<Alert>([]);

  constructor(
    public datePipe: DatePipe,
    private alertsService: AlertsService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.alertsService.getAll().subscribe({
      next: (alerts) => {
        this.dataSource.data = alerts;
      },
      error: (err) => {
        console.error('Error al obtener alertas:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

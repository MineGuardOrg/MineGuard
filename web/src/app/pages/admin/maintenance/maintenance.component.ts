import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule, DatePipe } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { MaintenanceService } from './maintenance.service';
import { TranslateModule } from '@ngx-translate/core';

export interface Maintenance {
  id: number;
  description: string;
  device_id: number;
  performed_by: number;
  created_at: string;
  updated_at: string;
}

@Component({
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
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
export class AppMaintenanceComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    'id',
    'description',
    'device_id',
    'performed_by',
    'created_at',
  ];
  dataSource = new MatTableDataSource<Maintenance>([]);

  constructor(
    public datePipe: DatePipe,
    private maintenanceService: MaintenanceService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadMaintenanceLogs();
  }

  loadMaintenanceLogs(): void {
    this.maintenanceService.getAll().subscribe({
      next: (logs) => {
        this.dataSource.data = logs;
      },
      error: (err) => {
        console.error('Error al obtener registros de mantenimiento:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule, DatePipe } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { IncidentsService } from './incidents.service';
import { TranslateModule } from '@ngx-translate/core';

export interface Incident {
  id: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id: number;
  device_id: number;
  reading_id: number;
  created_at: string;
  updated_at: string | null;
}

@Component({
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss'],
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
export class AppIncidentsComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    'id',
    'description',
    'severity',
    'user_id',
    'device_id',
    'reading_id',
    'created',
  ];
  dataSource = new MatTableDataSource<Incident>([]);

  constructor(
    public datePipe: DatePipe,
    private incidentsService: IncidentsService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadIncidents();
  }

  loadIncidents(): void {
    this.incidentsService.getAll().subscribe({
      next: (incidents) => {
        this.dataSource.data = incidents;
      },
      error: (err) => {
        console.error('Error al obtener reportes de incidentes:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'low':
        return 'bg-success';
      case 'medium':
        return 'bg-warning';
      case 'high':
        return 'bg-error';
      case 'critical':
        return 'bg-error';
      default:
        return 'bg-secondary';
    }
  }
}

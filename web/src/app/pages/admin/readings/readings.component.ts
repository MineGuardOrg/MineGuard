import {
  Component,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule, DatePipe } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { ReadingsService } from './readings.service';
import { TranslateModule } from '@ngx-translate/core';

export interface Reading {
  id: number;
  user_id: number;
  device_id: number;
  mq7?: number;       // CO en ppm
  pulse?: number;     // Frecuencia cardíaca en bpm
  ax?: number;        // Acelerómetro eje X (m/s²)
  ay?: number;        // Acelerómetro eje Y (m/s²)
  az?: number;        // Acelerómetro eje Z (m/s²)
  gx?: number;        // Giroscopio eje X (rad/s)
  gy?: number;        // Giroscopio eje Y (rad/s)
  gz?: number;        // Giroscopio eje Z (rad/s)
  timestamp: string;
}

@Component({
  templateUrl: './readings.component.html',
  styleUrls: ['./readings.component.scss'],
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
export class AppReadingsComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    'id',
    'user_id',
    'device_id',
    'mq7',
    'pulse',
    'accelerometer',
    'gyroscope',
    'timestamp',
  ];
  dataSource = new MatTableDataSource<Reading>([]);

  constructor(
    public datePipe: DatePipe,
    private readingsService: ReadingsService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadReadings();
  }

  loadReadings(): void {
    this.readingsService.getAll().subscribe({
      next: (readings) => {
        this.dataSource.data = readings;
      },
      error: (err) => {
        console.error('Error al obtener lecturas:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

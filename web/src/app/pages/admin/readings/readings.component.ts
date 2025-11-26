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
  value: number;
  sensor_id: number;
  user_id: number;
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
    'value',
    'sensor_id',
    'user_id',
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

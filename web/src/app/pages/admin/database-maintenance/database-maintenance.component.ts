import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from '../../../material.module';
import { DatabaseMaintenanceService } from '../database-maintenance/database-maintenance.service';

export interface TableMetadata {
  name: string;
  rowsCount: number;
  columnCount: number;
  sizeKb: number;
  engine: string;
  updateTime: string;
}

@Component({
  selector: 'app-selection-table',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    CommonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    TablerIconsModule,
    MaterialModule,
  ],
  templateUrl: './database-maintenance.component.html',
  styleUrls: ['./database-maintenance.component.scss'],
})
export class AppDatabaseMaintenanceComponent implements OnInit {
  loading = false;
  displayedColumns: string[] = [
    'select',
    'name',
    'columnCount',
    'rowsCount',
    'sizeKb',
    'updateTime',
  ];
  dataSource = new MatTableDataSource<TableMetadata>([]);
  selection = new SelectionModel<TableMetadata>(true, []);

  constructor(private dbService: DatabaseMaintenanceService) {}

  ngOnInit(): void {
    this.loading = true;
    this.dbService.getTableMetadata().subscribe({
      next: (tables: TableMetadata[]) => {
        this.dataSource.data = tables;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando tablas', err);
        this.loading = false;
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filterPredicate = (data: TableMetadata, filter: string) =>
      data.name.toLowerCase().includes(filter);
    this.dataSource.filter = filterValue;
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  checkboxLabel(row?: TableMetadata): string {
    if (!row) return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.name
    }`;
  }

  exportSelected(type: 'sql' | 'csv') {
    this.loading = true;

    if (type === 'sql') {
      this.dbService.exportBackupSQL().subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: 'application/sql' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          
          // Generar nombre con fecha actual
          const today = new Date();
          const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
          link.download = `backup_${dateStr}.sql`;
          
          link.click();
          window.URL.revokeObjectURL(url);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al exportar SQL:', err);
          alert('Error al generar el backup SQL. Por favor, intente nuevamente.');
          this.loading = false;
        },
      });
    } else if (type === 'csv') {
      this.dbService.exportBackupCSV().subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: 'application/zip' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          
          // Generar nombre con fecha actual
          const today = new Date();
          const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
          link.download = `backup_csv_${dateStr}.zip`;
          
          link.click();
          window.URL.revokeObjectURL(url);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al exportar CSV:', err);
          alert('Error al generar el backup CSV. Por favor, intente nuevamente.');
          this.loading = false;
        },
      });
    }
  }

  exportSchema() {
    this.loading = true;

    this.dbService.exportSchemaBackup().subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/sql' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Generar nombre con fecha actual
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
        link.download = `schema_backup_${dateStr}.sql`;
        
        link.click();
        window.URL.revokeObjectURL(url);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al exportar schema:', err);
        alert('Error al generar el backup del schema. Por favor, intente nuevamente.');
        this.loading = false;
      },
    });
  }
}

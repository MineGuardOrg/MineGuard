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
    const selectedTables = this.selection.selected.map((t) => t.name);
    if (!selectedTables.length) {
      alert('Please select at least one table.');
      return;
    }

    if (type === 'sql') {
      this.dbService.backupTables(selectedTables).subscribe((response) => {
        const blob = new Blob([response], { type: 'application/sql' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'backup_partial.sql';
        link.click();
        window.URL.revokeObjectURL(url);
      });
    } else if (type === 'csv') {
      if (selectedTables.length === 1) {
        // Exportar CSV directamente
        const table = selectedTables[0];
        this.dbService.exportTableToCSV(table).subscribe((response) => {
          const blob = new Blob([response], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${table}.csv`;
          link.click();
          window.URL.revokeObjectURL(url);
        });
      } else {
        // Exportar ZIP con múltiples CSV
        this.dbService
          .exportTablesToZip(selectedTables)
          .subscribe((response) => {
            const blob = new Blob([response], { type: 'application/zip' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `tables_export.zip`;
            link.click();
            window.URL.revokeObjectURL(url);
          });
      }
    }
  }
}

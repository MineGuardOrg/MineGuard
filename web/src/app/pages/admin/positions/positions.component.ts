import {
  Component,
  Inject,
  Optional,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { PositionsService } from './positions.service';

export interface Position {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

@Component({
  templateUrl: './positions.component.html',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgScrollbarModule,
    CommonModule,
  ],
  providers: [DatePipe],
})
export class AppPositionsComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'active',
    'action',
  ];
  dataSource = new MatTableDataSource<Position>([]);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private positionsService: PositionsService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadPositions();
  }

  loadPositions(): void {
    this.positionsService.getAll().subscribe({
      next: (positions) => {
        this.dataSource.data = positions;
      },
      error: (err) => {
        console.error('Error al obtener posiciones:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppPositionsDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.addRowData(result.data);
      } else if (result?.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result?.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj: Position): void {
    const currentData = this.dataSource.data;
    this.dataSource.data = [row_obj, ...currentData];
    this.table.renderRows();
  }

  updateRowData(row_obj: Position): void {
    this.positionsService.update(row_obj).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((position) =>
          position.id === res.id ? res : position
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al actualizar posición:', err);
      },
    });
  }

  deleteRowData(row_obj: Position): void {
    this.positionsService.delete(row_obj.id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(
          (position) => position.id !== row_obj.id
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al eliminar posición:', err);
      },
    });
  }
}

@Component({
  selector: 'app-positions-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    MaterialModule,
    TablerIconsModule,
    CommonModule,
  ],
  providers: [DatePipe],
  templateUrl: 'positions-dialog-component.html',
})
export class AppPositionsDialogComponent {
  public action: string;
  local_data: any;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppPositionsDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Position,
    private positionsService: PositionsService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    if (this.action === 'Add') {
      const payload = {
        name: this.local_data.name,
        description: this.local_data.description || null,
      };

      this.positionsService.create(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al crear posición:', err);
        },
      });
    } else if (this.action === 'Update') {
      const payload = {
        id: this.local_data.id,
        name: this.local_data.name,
        description: this.local_data.description || null,
        is_active: this.local_data.is_active,
      };

      this.positionsService.update(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al actualizar posición:', err);
        },
      });
    } else if (this.action === 'Delete') {
      this.dialogRef.close({ event: this.action, data: this.local_data });
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

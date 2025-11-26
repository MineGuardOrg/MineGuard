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
import { ShiftsService } from './shifts.service';
import { TranslateModule } from '@ngx-translate/core';

export interface Shift {
  id: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

@Component({
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss'],
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
export class AppShiftsComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    'id',
    'start_time',
    'end_time',
    'active',
    'action',
  ];
  dataSource = new MatTableDataSource<Shift>([]);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private shiftsService: ShiftsService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadShifts();
  }

  loadShifts(): void {
    this.shiftsService.getAll().subscribe({
      next: (shifts) => {
        this.dataSource.data = shifts;
      },
      error: (err) => {
        console.error('Error al obtener turnos:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppShiftsDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.addRowData(result.data);
      } else if (result?.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result?.event === 'Delete') {
        this.deleteRowData(result.data);
      } else if (result?.event === 'Reactivate') {
        this.reactivateRowData(result.data);
      }
    });
  }

  addRowData(row_obj: Shift): void {
    const currentData = this.dataSource.data;
    this.dataSource.data = [row_obj, ...currentData];
    this.table.renderRows();
  }

  updateRowData(row_obj: Shift): void {
    this.shiftsService.update(row_obj).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((shift) =>
          shift.id === res.id ? res : shift
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al actualizar turno:', err);
      },
    });
  }

  deleteRowData(row_obj: Shift): void {
    const updatePayload = {
      id: row_obj.id,
      start_time: row_obj.start_time,
      end_time: row_obj.end_time,
      is_active: false
    };

    this.shiftsService.update(updatePayload).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((shift) =>
          shift.id === res.id ? res : shift
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al desactivar turno:', err);
      },
    });
  }

  reactivateRowData(row_obj: Shift): void {
    const updatePayload = {
      id: row_obj.id,
      start_time: row_obj.start_time,
      end_time: row_obj.end_time,
      is_active: true
    };

    this.shiftsService.update(updatePayload).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((shift) =>
          shift.id === res.id ? res : shift
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al reactivar turno:', err);
      },
    });
  }
}

@Component({
  selector: 'app-shifts-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    MaterialModule,
    TablerIconsModule,
    CommonModule,
    TranslateModule,
  ],
  providers: [DatePipe],
  templateUrl: 'shifts-dialog-component.html',
})
export class AppShiftsDialogComponent {
  public action: string;
  local_data: any;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppShiftsDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Shift,
    private shiftsService: ShiftsService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    if (this.action === 'Add') {
      const payload = {
        start_time: this.local_data.start_time,
        end_time: this.local_data.end_time,
      };

      this.shiftsService.create(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al crear turno:', err);
        },
      });
    } else if (this.action === 'Update') {
      const payload = {
        id: this.local_data.id,
        start_time: this.local_data.start_time,
        end_time: this.local_data.end_time,
        is_active: this.local_data.is_active,
      };

      this.shiftsService.update(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al actualizar turno:', err);
        },
      });
    } else if (this.action === 'Delete') {
      this.dialogRef.close({ event: this.action, data: this.local_data });
    }
  }

  doActionReactivate(): void {
    this.dialogRef.close({ event: 'Reactivate', data: this.local_data });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
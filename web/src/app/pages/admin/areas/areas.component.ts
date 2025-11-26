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
import { AreasService } from './areas.service';
import { TranslateModule } from '@ngx-translate/core';

export interface Area {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

@Component({
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss'],
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
export class AppAreasComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'active',
    'created',
    'action',
  ];
  dataSource = new MatTableDataSource<Area>([]);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private areasService: AreasService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadAreas();
  }

  loadAreas(): void {
    this.areasService.getAll().subscribe({
      next: (areas) => {
        this.dataSource.data = areas;
      },
      error: (err) => {
        console.error('Error al obtener áreas:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppAreasDialogComponent, {
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

  addRowData(row_obj: Area): void {
    const currentData = this.dataSource.data;
    this.dataSource.data = [row_obj, ...currentData];
    this.table.renderRows();
  }

  updateRowData(row_obj: Area): void {
    this.areasService.update(row_obj).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((area) =>
          area.id === res.id ? res : area
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al actualizar área:', err);
      },
    });
  }

  deleteRowData(row_obj: Area): void {
    const updatePayload = {
      id: row_obj.id,
      name: row_obj.name,
      description: row_obj.description,
      is_active: false
    };

    this.areasService.update(updatePayload).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((area) =>
          area.id === res.id ? res : area
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al desactivar área:', err);
      },
    });
  }

  reactivateRowData(row_obj: Area): void {
    const updatePayload = {
      id: row_obj.id,
      name: row_obj.name,
      description: row_obj.description,
      is_active: true
    };

    this.areasService.update(updatePayload).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((area) =>
          area.id === res.id ? res : area
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al reactivar área:', err);
      },
    });
  }
}

@Component({
  selector: 'app-areas-dialog',
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
  templateUrl: 'areas-dialog-component.html',
})
export class AppAreasDialogComponent {
  public action: string;
  local_data: any;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppAreasDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Area,
    private areasService: AreasService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    if (this.action === 'Add') {
      const payload = {
        name: this.local_data.name,
        description: this.local_data.description,
      };

      this.areasService.create(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al crear área:', err);
        },
      });
    } else if (this.action === 'Update') {
      const payload = {
        id: this.local_data.id,
        name: this.local_data.name,
        description: this.local_data.description,
        is_active: this.local_data.is_active,
      };

      this.areasService.update(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al actualizar área:', err);
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

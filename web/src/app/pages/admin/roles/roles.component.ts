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
import { RolesService } from './roles.service';
import { TranslateModule } from '@ngx-translate/core';

export interface Role {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

@Component({
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
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
export class AppRolesComponent implements AfterViewInit {
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
  dataSource = new MatTableDataSource<Role>([]);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private rolesService: RolesService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadRoles();
  }

  loadRoles(): void {
    this.rolesService.getAll().subscribe({
      next: (roles) => {
        this.dataSource.data = roles;
      },
      error: (err) => {
        console.error('Error al obtener roles:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppRolesDialogComponent, {
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

  addRowData(row_obj: Role): void {
    const currentData = this.dataSource.data;
    this.dataSource.data = [row_obj, ...currentData];
    this.table.renderRows();
  }

  updateRowData(row_obj: Role): void {
    this.rolesService.update(row_obj).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((role) =>
          role.id === res.id ? res : role
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al actualizar rol:', err);
      },
    });
  }

  deleteRowData(row_obj: Role): void {
    this.rolesService.delete(row_obj.id).subscribe({
      next: () => {
        // Soft delete: actualizar el estado is_active en lugar de eliminar
        this.dataSource.data = this.dataSource.data.map((role) =>
          role.id === row_obj.id ? { ...role, is_active: false } : role
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al desactivar rol:', err);
      },
    });
  }

  reactivateRowData(row_obj: Role): void {
    // Reactivar rol cambiando is_active a true
    const payload = {
      id: row_obj.id,
      is_active: true
    };
    this.rolesService.update(payload).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((role) =>
          role.id === res.id ? res : role
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al reactivar rol:', err);
      },
    });
  }
}

@Component({
  selector: 'app-roles-dialog-content',
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
  templateUrl: 'roles-dialog-component.html',
})
export class AppRolesDialogComponent {
  public action: string;
  local_data: any;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppRolesDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Role,
    private rolesService: RolesService
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

      this.rolesService.create(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al crear rol:', err);
        },
      });
    } else if (this.action === 'Update') {
      const payload = {
        id: this.local_data.id,
        name: this.local_data.name,
        description: this.local_data.description,
        is_active: this.local_data.is_active,
      };

      this.rolesService.update(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al actualizar rol:', err);
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

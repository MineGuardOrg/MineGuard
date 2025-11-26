import {
  Component,
  Inject,
  Optional,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  MatTableDataSource,
  MatTable,
} from '@angular/material/table';
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
import { UsersService } from './users.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export interface User {
  id: number;
  employee_number: string;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
  area_id: number | null;
  position_id: number | null;
  supervisor_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
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
export class AppUsersComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    'id',
    'employee_number',
    'name',
    'email',
    'role',
    'active',
    'created',
    'action',
  ];
  dataSource = new MatTableDataSource<User>([]);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private usersService: UsersService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getAll().subscribe({
      next: (users) => {
        // Mapear los usuarios para agregar el nombre completo
        const mappedUsers = users.map((user: User) => ({
          ...user,
          fullName: `${user.first_name} ${user.last_name}`
        }));
        this.dataSource.data = mappedUsers;
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppKichenSinkDialogComponent, {
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

  addRowData(row_obj: User): void {
    const mappedUser = {
      ...row_obj,
      fullName: `${row_obj.first_name} ${row_obj.last_name}`
    };
    const currentData = this.dataSource.data;
    this.dataSource.data = [mappedUser, ...currentData];
    this.table.renderRows();
  }

  updateRowData(row_obj: User): void {
    this.usersService.update(row_obj).subscribe({
      next: (res) => {
        // Agregar fullName al usuario actualizado
        const mappedUser = {
          ...res,
          fullName: `${res.first_name} ${res.last_name}`
        };
        // Actualizar la tabla local con el objeto actualizado
        this.dataSource.data = this.dataSource.data.map((user) =>
          user.id === res.id ? mappedUser : user
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
      },
    });
  }

  deleteRowData(row_obj: User): void {
    this.usersService.delete(row_obj.id).subscribe({
      next: () => {
        // Soft delete: actualizar el estado is_active en lugar de eliminar
        this.dataSource.data = this.dataSource.data.map((user) =>
          user.id === row_obj.id ? { ...user, is_active: false } : user
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al desactivar usuario:', err);
      },
    });
  }

  reactivateRowData(row_obj: User): void {
    // Reactivar usuario cambiando is_active a true
    const payload = {
      id: row_obj.id,
      is_active: true
    };
    this.usersService.update(payload).subscribe({
      next: (res) => {
        // Agregar fullName al usuario reactivado
        const mappedUser = {
          ...res,
          fullName: `${res.first_name} ${res.last_name}`
        };
        this.dataSource.data = this.dataSource.data.map((user) =>
          user.id === res.id ? mappedUser : user
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al reactivar usuario:', err);
      },
    });
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-component',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MaterialModule, TablerIconsModule, CommonModule, TranslateModule],
  providers: [DatePipe],
  templateUrl: 'users-dialog-component.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppKichenSinkDialogComponent {
  public action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppKichenSinkDialogComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: User,
    private usersService: UsersService,
    private translate: TranslateService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    if (this.action === 'Add') {
      // Validar contraseña
      if (!this.local_data.password || this.local_data.password.length < 8) {
        alert(this.translate.instant('USERS.PASSWORD_ERROR'));
        return;
      }

      const payload = {
        employee_number: this.local_data.employee_number,
        first_name: this.local_data.first_name,
        last_name: this.local_data.last_name,
        email: this.local_data.email,
        password: this.local_data.password,
        role_id: this.local_data.role_id,
      };

      this.usersService.create(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al crear usuario:', err);
        },
      });
    } else {
      // Validar contraseña si se proporciona
      if (this.local_data.password && this.local_data.password.length < 8) {
        alert(this.translate.instant('USERS.PASSWORD_ERROR'));
        return;
      }

      const payload: any = {
        id: this.local_data.id,
        employee_number: this.local_data.employee_number,
        first_name: this.local_data.first_name,
        last_name: this.local_data.last_name,
        email: this.local_data.email,
        role_id: this.local_data.role_id,
      };

      // Solo incluir password si se proporcionó
      if (this.local_data.password) {
        payload.password = this.local_data.password;
      }

      this.dialogRef.close({ event: this.action, data: payload });
    }
  }

  doActionReactivate(): void {
    this.dialogRef.close({ event: 'Reactivate', data: this.local_data });
  }


  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

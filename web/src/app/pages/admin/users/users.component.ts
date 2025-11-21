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
import { AppAddUsersComponent } from './add/add.component';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { UsersService } from './users.service';

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
      }
    });
  }

  addRowData(row_obj: User): void {
    const currentData = this.dataSource.data;
    this.dataSource.data = [row_obj, ...currentData];
    this.dialog.open(AppAddUsersComponent);
    this.table.renderRows();
  }

  updateRowData(row_obj: User): void {
    this.usersService.update(row_obj).subscribe({
      next: (res) => {
        // Actualizar la tabla local con el objeto actualizado
        this.dataSource.data = this.dataSource.data.map((user) =>
          user.id === res.id ? res : user
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
        this.dataSource.data = this.dataSource.data.filter(
          (user) => user.id !== row_obj.id
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
      },
    });
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-component',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MaterialModule, TablerIconsModule, CommonModule],
  providers: [DatePipe],
  templateUrl: 'users-dialog-component.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppKichenSinkDialogComponent {
  public action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppKichenSinkDialogComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: User,
    private usersService: UsersService // <-- Esto debe estar
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    // if (this.local_data.RegisterDate !== undefined) {
    //   this.joiningDate = this.datePipe.transform(
    //     new Date(this.local_data.RegisterDate),
    //     'yyyy-MM-dd'
    //   );
    // }
    if (this.local_data.imagePath === undefined) {
      this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
    }
  }

  doAction(): void {
    if (this.action === 'Add') {
      const payload = {
        name: this.local_data.name,
        email: this.local_data.email,
        password: this.local_data.password,
        rol: this.local_data.rol,
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
      const payload = {
        id: this.local_data.id,
        name: this.local_data.name,
        email: this.local_data.email,
        password: this.local_data.password,
        rol: this.local_data.rol,
        phone: this.local_data.phone // solo se manda en PUT
      };
      this.dialogRef.close({ event: this.action, data: payload });
    }
  }


  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      // this.msg = 'You must select an image';
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.msg = "Only images are supported";
      return;
    }
    // tslint:disable-next-line - Disables all
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    // tslint:disable-next-line - Disables all
    reader.onload = (_event) => {
      // tslint:disable-next-line - Disables all
      this.local_data.imagePath = reader.result;
    };
  }
}

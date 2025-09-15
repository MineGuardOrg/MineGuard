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
  MatTableModule,
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';

export interface UserAnswer {
  id: number;
  UserId: number;
  QuestionId: number;
  Answer: string;
  IsCorrect: number;
  Date: string;
}

const usersAnwers = [
  {
    id: 1,
    UserId: 1,
    QuestionId: 1,
    Answer: 'Answer',
    IsCorrect: 1,
    Date: '2022-02-21',
  },
  {
    id: 2,
    UserId: 2,
    QuestionId: 2,
    Answer: 'Answer',
    IsCorrect: 2,
    Date: '2022-02-21',
  },
  {
    id: 3,
    UserId: 3,
    QuestionId: 3,
    Answer: 'Answer',
    IsCorrect: 3,
    Date: '2022-02-21',
  },
];

@Component({
  templateUrl: './usersAnswers.component.html',
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
export class AppUsersAnswersComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  displayedColumns: string[] = [
    '#',
    'UserId',
    'QuestionId',
    'Answer',
    'IsCorrect',
    'Date',
    'action',
  ];
  dataSource = new MatTableDataSource(usersAnwers);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppUsersAnswersDialogContentComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addRowData(result.data);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  // tslint:disable-next-line - Disables all
  addRowData(row_obj: UserAnswer): void {
    this.dataSource.data.unshift({
      id: usersAnwers.length + 1,
      UserId: row_obj.UserId,
      QuestionId: row_obj.QuestionId,
      Answer:  row_obj.Answer,
      IsCorrect: row_obj.IsCorrect,
      Date: row_obj.Date,
    });
    this.dialog.open(AppAddUsersComponent);
    this.table.renderRows();
  }

  // tslint:disable-next-line - Disables all
  updateRowData(row_obj: UserAnswer): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      if (value.id === row_obj.id) {
        value.UserId = row_obj.UserId;
        value.QuestionId = row_obj.QuestionId;
        value.Answer = row_obj.Answer;
        value.IsCorrect = row_obj.IsCorrect;
        value.Date = row_obj.Date;
      }
      return true;
    });
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: UserAnswer): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      return value.id !== row_obj.id;
    });
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MaterialModule],
  providers: [DatePipe],
  templateUrl: 'usersAnswers-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppUsersAnswersDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';
  
  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppUsersAnswersDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UserAnswer
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
    this.dialogRef.close({ event: this.action, data: this.local_data });
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

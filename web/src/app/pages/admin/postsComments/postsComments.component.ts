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
import { AppAddPostsCommentsComponent } from './add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { PostsCommentsService } from './postsComments.service';

export interface PostComment {
  postCommentId: number;
  content: string;
  createdName: string;
  createdDate: string;
}

@Component({
  templateUrl: './postsComments.component.html',
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
export class AppPostsCommentsComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  searchText: any;
  displayedColumns: string[] = [
    '#',
    'Content',
    'Created By',
    'Created Date',
    'action',
  ];
  dataSource = new MatTableDataSource<PostComment>([]);

  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private postscommentsService: PostsCommentsService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadPostsComments();
  }

  loadPostsComments(): void {
    this.postscommentsService.getAll().subscribe({
      next: (postscomments) => {
        this.dataSource.data = postscomments;
      },
      error: (err) => {
        console.error('Error al obtener comentarios de publicaciones:', err);
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppKichenSinkDialogContentComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.event === 'Add') {
        this.addRowData(result.data);
      } else if (result && result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result && result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  // tslint:disable-next-line - Disables all
  addRowData(row_obj: PostComment): void {
    const currentData = this.dataSource.data;
    this.dataSource.data = [row_obj, ...currentData];
    this.table.renderRows();
  }

  // tslint:disable-next-line - Disables all
  updateRowData(row_obj: PostComment): void {
    const payload = {
      postCommentId: row_obj.postCommentId,
      content: row_obj.content,
    };

    this.postscommentsService.update(payload).subscribe({
      next: (res) => {
        this.dataSource.data = this.dataSource.data.map((comment) =>
          comment.postCommentId === res.postCommentId ? res : comment
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al actualizar comentario:', err);
      },
    });
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: PostComment): void {
    this.postscommentsService.delete(row_obj.postCommentId).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(
          (post) => post.postCommentId !== row_obj.postCommentId
        );
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error al eliminar publicación:', err);
      },
    });
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MaterialModule],
  providers: [DatePipe],
  templateUrl: 'postsComments-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppKichenSinkDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppKichenSinkDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: PostComment,
    public postscommentsService: PostsCommentsService
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
    if (this.action === 'Update') {
      // ✅ Solo enviar el content
      const payload = {
        postCommentId: this.local_data.postCommentId, // Para la URL
        content: this.local_data.content, // Solo el contenido
      };

      this.postscommentsService.update(payload).subscribe({
        next: (res) => {
          this.dialogRef.close({ event: this.action, data: res });
        },
        error: (err) => {
          console.error('Error al actualizar comentario:', err);
        },
      });
    } else if (this.action === 'Delete') {
      this.dialogRef.close({ event: this.action, data: this.local_data });
    } else {
      this.dialogRef.close({ event: 'Cancel' });
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

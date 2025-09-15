import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForumService } from './forum.service';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Post,
  CreateCommentRequest,
  CreatePostRequest,
} from './post';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AppAddPostComponent } from './add/add.component';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MaterialModule,
    MatCardModule,
    TablerIconsModule,
    MatChipsModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
})
export class AppForumComponent implements OnInit {
  forumPosts: Post[] = [];
  newComments: { [postId: number]: string } = {};
  newPost: CreatePostRequest = {
    title: '',
    content: '',
  };

  constructor(
    private router: Router,
    private forumService: ForumService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  addPost(form: NgForm) {
    if (!this.newPost.title.trim() || !this.newPost.content.trim()) {
      alert('El título y contenido no pueden estar vacíos');
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      alert('Debes iniciar sesión para crear un post.');
      return;
    }

    this.forumService.create(this.newPost, token).subscribe({
      next: (res) => {
        this.newPost.title = '';
        this.newPost.content = '';
        this.loadPosts();
        form.resetForm();

        this.dialog.open(AppAddPostComponent, {
          data: { message: '¡Post publicado correctamente!' }
        });
      },
      error: (err) => {
        console.error('Error al crear el post', err);
        alert('Error al crear el post');
      },
    });
  }

  loadPosts(): void {
    this.forumService.getAll().subscribe({
      next: (data: any[]) => {
        this.forumPosts = data.map((post) => ({
          postId: post.postId,
          title: post.title,
          content: post.content,
          createdBy: post.createdBy || 'Anónimo',
          createdDate: post.createdDate || '',
          postComment:
            post.postComment?.map((comment: any) => ({
              postCommentId: comment.postCommentId,
              content: comment.content,
              createdName: comment.createdName || 'Anónimo',
              createdDate: comment.createdDate || '',
            })) || [],
        }));
      },
      error: (err) => {
        console.error('Error al cargar los posts del foro', err);
      },
    });
  }

  addComment(postId: number) {
    const content = this.newComments[postId];
    if (!content || content.trim() === '') {
      alert('El comentario no puede estar vacío');
      return;
    }

    const commentPayload: CreateCommentRequest = {
      postId: postId,
      content: content.trim(),
    };

    const token = this.authService.getToken();
    if (!token) {
      alert('Debes iniciar sesión para agregar un comentario.');
      return;
    }

    this.forumService.createComment(commentPayload, token).subscribe({
      next: (res) => {
        this.newComments[postId] = '';
        this.loadPosts();
      },
      error: (err) => {
        console.error('Error al agregar el comentario', err);
        alert('Error al agregar el comentario');
      },
    });
  }

  selectBlog(postId: number) {
    if (!postId) {
      console.error('El postId no es válido:', postId);
      return;
    }
    this.router.navigate(['learning/forum/details', postId]);
  }

  getRelativeDate(dateString: string): string {
    if (!dateString) return '';

    // Forzar que la fecha sea tratada como UTC
    const isoString = dateString.replace(' ', 'T') + 'Z';
    const date = new Date(isoString);
    const now = new Date();

    let diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) diffMs = 1000; // Si por alguna razón sigue saliendo negativa

    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) return `${seconds}seg`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}min`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} sem`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} m`;

    const years = Math.floor(days / 365);
    return `${years} a`;
  }
}

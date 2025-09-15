import { Component, OnInit } from '@angular/core';
import { ForumService } from '../forum.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Post } from '../post';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    TablerIconsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class AppForumDetailsComponent implements OnInit {
  forumDetail: Post | undefined;
  istoggleReply = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private forumService: ForumService
  ) {}

  toggleReply() {
    this.istoggleReply = !this.istoggleReply;
  }

  ngOnInit(): void {
    const postIdParam = this.route.snapshot.paramMap.get('id');
    if (!postIdParam) {
      console.error('No se encontró el id del post en la URL');
      return;
    }

    const postId = Number(postIdParam);

    // Traer el detalle directo desde la API
    this.forumService.getAll().subscribe({
      next: (posts) => {
        this.forumDetail = posts.find((post: { postId: number; }) => post.postId === postId);
        if (!this.forumDetail) {
          console.error('Post no encontrado');
        }
      },
      error: (err) => {
        console.error('Error al obtener el post:', err);
      }
    });
  }
}
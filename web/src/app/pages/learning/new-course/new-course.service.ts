import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'any',
})
export class NewCourseService {
  private apiUrl = `${environment.apiUrl}/Course`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  create(post: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.apiUrl}/create`, post, { headers });
  }

  getCategories(token: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any[]>(`${environment.apiUrl}/Category/list`, {
      headers,
    });
  }
}

@Injectable({
  providedIn: 'any',
})
export class LessonCourseService {
  private apiUrl = `${environment.apiUrl}/lessoncourse`;

  constructor(private http: HttpClient) {}

  createLessonCourse(post: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.apiUrl}/create`, post, { headers });
  }
}

@Injectable({
  providedIn: 'any',
})
export class LessonService {
  private apiUrl = `${environment.apiUrl}/lesson`;

  constructor(private http: HttpClient) {}

  createLesson(post: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.apiUrl}/create`, post, { headers });
  }
}
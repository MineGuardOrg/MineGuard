import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
export class LessonsService {
  private apiUrl = `${environment.apiUrl}/Lesson`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(lesson: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, lesson);
  }

  update(lesson: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${lesson.id}`, lesson);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}

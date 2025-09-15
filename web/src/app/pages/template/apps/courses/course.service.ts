import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'any',
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/CourseSuscribedByUser`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // getAll(): Observable<any> {
  //   const token = this.authService.getToken();
  //   let headers = new HttpHeaders();

  //   if (token) {
  //     headers = headers.set('Authorization', `Bearer ${token}`);
  //   }

  //   return this.http.get(`${this.apiUrl}/listNotSuscribed`, { headers });
  // }
  getAll(): Observable<any> {
    // Token hardcodeado solo para pruebas
    const hardcodedToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE4IiwibmFtZSI6InVzZXIiLCJlbWFpbCI6InVzZXJAZ21haWwuY29tIiwicm9sIjoiVXNlciIsIm5iZiI6MTc1MzUwODEzOSwiZXhwIjoxNzUzNTk0NTM5LCJpYXQiOjE3NTM1MDgxMzl9.DSAE6wwzGLYFC8WT5zEXay7Ya9zSuJNRBX5BBQ1WFn8';

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${hardcodedToken}`
    );

    return this.http.get(`${this.apiUrl}/listNotSuscribed`, { headers });
  }
}

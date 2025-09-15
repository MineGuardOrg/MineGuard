import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'any',
})
export class MyCoursesService {
  private apiUrl = `${environment.apiUrl}/CourseSuscribedByUser`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getMyCourses(): Observable<any> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get(`${this.apiUrl}/list`, { headers });
  }

  getCourseDetails(courseId: number): Observable<any> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get(
      `${environment.apiUrl}/course/getAllInformation/${courseId}`,
      {
        headers,
      }
    );
  }

  // delete(id: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/delete/${id}`, {
  //     headers: this.getAuthHeaders(),
  //   });
  // }
}

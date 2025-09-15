import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'any',
})
export class CourseDetailService {
  private apiUrl = `${environment.apiUrl}/Enrollment`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  enrollToCourse(userId: number, courseId: number): Observable<any> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const payload = {
      userId,
      courseId,
    };

    return this.http.post(`${this.apiUrl}/create`, payload, { headers });
  }
}

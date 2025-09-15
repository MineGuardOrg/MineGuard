import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'any',
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/Course`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAll(): Observable<any> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get(`${this.apiUrl}/listunsuscribed`, { headers });
  }
}

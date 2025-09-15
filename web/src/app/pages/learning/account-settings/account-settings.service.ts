import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'any',
})
export class AccountSettingsService {
  private apiUrl = `${environment.apiUrl}/Auth/profile`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken() || '';
    // console.log('Bearer Token:', token); // ← Asegúrate de que este no esté vacío
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getProfile(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  update(profile: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${profile.id}`, profile, {
      headers: this.getAuthHeaders(),
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

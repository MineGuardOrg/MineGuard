import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  private apiUrl = `${environment.apiUrl}/devices`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Obtiene los headers con el token JWT
   */
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Obtiene todos los dispositivos
   */
  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene un dispositivo por ID
   */
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene dispositivos por user_id
   */
  getByUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-user/${userId}`, { headers: this.getHeaders() });
  }

  /**
   * Crea un nuevo dispositivo
   */
  create(device: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, device, { headers: this.getHeaders() });
  }

  /**
   * Actualiza un dispositivo existente
   */
  update(device: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${device.id}`, device, { headers: this.getHeaders() });
  }

  /**
   * Elimina un dispositivo
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}

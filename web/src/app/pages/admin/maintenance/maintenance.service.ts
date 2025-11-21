import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'any',
})
export class MaintenanceService {
  private apiUrl = `${environment.apiUrl}/maintenance`;

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
   * Obtiene todos los registros de mantenimiento
   */
  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene un registro de mantenimiento por ID
   */
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene registros de mantenimiento por dispositivo
   */
  getByDevice(deviceId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-device/${deviceId}`, { headers: this.getHeaders() });
  }

  /**
   * Crea un nuevo registro de mantenimiento
   */
  create(maintenanceLog: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, maintenanceLog, { headers: this.getHeaders() });
  }

  /**
   * Actualiza un registro de mantenimiento existente
   */
  update(maintenanceLog: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${maintenanceLog.id}`, maintenanceLog, { headers: this.getHeaders() });
  }

  /**
   * Elimina un registro de mantenimiento
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}

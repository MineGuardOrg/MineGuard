import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class IncidentsService {
  private apiUrl = `${environment.apiUrl}/incidents`;

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
   * Obtiene todos los reportes de incidentes
   */
  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene un reporte de incidente por ID
   */
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene reportes de incidentes por user_id
   */
  getByUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-user/${userId}`, { headers: this.getHeaders() });
  }

  /**
   * Crea un nuevo reporte de incidente
   */
  create(incident: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, incident, { headers: this.getHeaders() });
  }

  /**
   * Actualiza un reporte de incidente existente
   */
  update(incident: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${incident.id}`, incident, { headers: this.getHeaders() });
  }

  /**
   * Elimina un reporte de incidente
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}

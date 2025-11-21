import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ShiftsService {
  private apiUrl = `${environment.apiUrl}/shifts`;

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
   * Obtiene todos los turnos
   */
  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene un turno por ID
   */
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  /**
   * Crea un nuevo turno
   */
  create(shift: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, shift, { headers: this.getHeaders() });
  }

  /**
   * Actualiza un turno existente
   */
  update(shift: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${shift.id}`, shift, { headers: this.getHeaders() });
  }

  /**
   * Elimina un turno
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PositionsService {
  private apiUrl = `${environment.apiUrl}/positions`;

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
   * Obtiene todas las posiciones
   */
  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene una posición por ID
   */
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  /**
   * Crea una nueva posición
   */
  create(position: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, position, { headers: this.getHeaders() });
  }

  /**
   * Actualiza una posición existente
   */
  update(position: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${position.id}`, position, { headers: this.getHeaders() });
  }

  /**
   * Elimina una posición
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}

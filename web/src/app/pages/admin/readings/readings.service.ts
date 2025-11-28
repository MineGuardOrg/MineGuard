import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReadingsService {
  private apiUrl = `${environment.apiUrl}/readings`;

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
   * Obtiene todas las lecturas
   */
  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene una lectura por ID
   */
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene lecturas por device_id
   */
  getByDevice(deviceId: number, start?: string, end?: string): Observable<any> {
    let url = `${this.apiUrl}/by-device/${deviceId}`;
    const params: string[] = [];
    
    if (start) params.push(`start=${start}`);
    if (end) params.push(`end=${end}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    return this.http.get(url, { headers: this.getHeaders() });
  }

  /**
   * Obtiene la última lectura de un dispositivo
   */
  getLatestByDevice(deviceId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-device/${deviceId}/latest`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene lecturas por user_id
   */
  getByUser(userId: number, limit: number = 100): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-user/${userId}?limit=${limit}`, { headers: this.getHeaders() });
  }

  /**
   * Crea una nueva lectura con todos los sensores
   * (Las lecturas normalmente las crea el hardware del casco)
   */
  create(reading: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, reading, { headers: this.getHeaders() });
  }
}

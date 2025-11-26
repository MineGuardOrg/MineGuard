import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'any',
})
export class DatabaseMaintenanceService {
  private apiUrl = `${environment.apiUrl}/database-maintenance`;

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

  getTableMetadata(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tables/metadata`, { 
      headers: this.getHeaders() 
    });
  }

  // Exportar backup completo en formato SQL
  exportBackupSQL(): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/backup`, {}, {
      headers: this.getHeaders(),
      responseType: 'blob',
    });
  }

  // Exportar backup completo en formato CSV (ZIP con todos los archivos CSV)
  exportBackupCSV(): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/backup-csv`, {}, {
      headers: this.getHeaders(),
      responseType: 'blob',
    });
  }
}

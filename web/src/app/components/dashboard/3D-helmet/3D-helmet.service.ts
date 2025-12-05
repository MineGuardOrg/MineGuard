import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, interval, switchMap, startWith } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

export interface ReadingData {
  id: number;
  user_id: number;
  device_id: number;
  mq7?: number;
  pulse?: number;
  body_temp?: number;
  ax?: number;
  ay?: number;
  az?: number;
  gx?: number;
  gy?: number;
  gz?: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class HelmetService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

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
   * Obtiene la última lectura del usuario autenticado
   */
  getMyLatestReading(): Observable<ReadingData> {
    return this.http.get<ReadingData>(`${this.apiUrl}/my-readings`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Polling: Obtiene las lecturas cada X segundos
   * @param intervalMs Intervalo en milisegundos (default: 2000ms = 2 segundos)
   */
  getMyLatestReadingPolling(intervalMs: number = 2000): Observable<ReadingData> {
    return interval(intervalMs).pipe(
      startWith(0), // Emite inmediatamente
      switchMap(() => this.getMyLatestReading())
    );
  }
}

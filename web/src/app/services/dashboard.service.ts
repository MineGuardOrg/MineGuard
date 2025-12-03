import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface ActiveWorker {
  id: number;
  nombre: string;
  numeroEmpleado: string;
  area: string | null;
  ritmoCardiaco: number | null;
  temperaturaCorporal: number | null;
  nivelBateria: number | null;
  tiempoActivo_ts: string;
  cascoId: number;
}

export interface CriticalAlertsStats {
  critical_count: number;
  total_last_24h: number;
}

export interface DeviceStats {
  active_devices: number;
  total_devices: number;
  connection_rate: number;
}

export interface RiskLevel {
  risk_level: string;
  critical_alerts_count: number;
  affected_areas_count: number;
  recommendation: string;
}

export interface AlertsByTypeWeekly {
  labels: string[];
  gasesToxicos: number[];
  ritmoCardiacoAnormal: number[];
  temperaturaCorporalAlta: number[];
  caidasImpactos: number[];
}

export interface BiometricsByArea {
  areas: string[];
  ritmoCardiaco: number[];
  temperaturaCorporal: number[];
}

export interface RecentAlert {
  id: number;
  tipo: string;
  mensaje: string;
  trabajador: string;
  area: string | null;
  severidad: string;
  timestamp: string;
  estado: string | null;
  valor: number | null;
  user_id: number;
  device_id: number;
  reading_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Obtiene los headers con el token de autenticación
   */
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /**
   * Obtiene todos los trabajadores activos (para manager)
   */
  getActiveWorkers(): Observable<ActiveWorker[]> {
    return this.http.get<ActiveWorker[]>(`${this.apiUrl}/active-workers`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Obtiene estadísticas de alertas críticas
   */
  getCriticalAlertsStats(): Observable<CriticalAlertsStats> {
    return this.http.get<CriticalAlertsStats>(`${this.apiUrl}/alerts/critical-stats`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Obtiene estadísticas de dispositivos
   */
  getDeviceStats(): Observable<DeviceStats> {
    return this.http.get<DeviceStats>(`${this.apiUrl}/devices/stats`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Obtiene el nivel de riesgo calculado
   */
  getRiskLevel(): Observable<RiskLevel> {
    return this.http.get<RiskLevel>(`${this.apiUrl}/risk-level`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Obtiene alertas por tipo agrupadas por semana
   */
  getAlertsByTypeWeekly(): Observable<AlertsByTypeWeekly> {
    return this.http.get<AlertsByTypeWeekly>(`${this.apiUrl}/alerts/by-type-weekly`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Obtiene promedios biométricos por área
   */
  getBiometricsByArea(days: number = 30): Observable<BiometricsByArea> {
    return this.http.get<BiometricsByArea>(`${this.apiUrl}/biometrics/avg-by-area?days=${days}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Obtiene alertas recientes
   */
  getRecentAlerts(days: number = 7, limit: number = 20): Observable<RecentAlert[]> {
    return this.http.get<RecentAlert[]>(`${this.apiUrl}/alerts/recent?days=${days}&limit=${limit}`, {
      headers: this.getHeaders(),
    });
  }
}

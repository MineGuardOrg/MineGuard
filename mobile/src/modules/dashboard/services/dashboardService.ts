import { apiClient } from '../../../core/api';
import { API_ENDPOINTS, WS_BASE_URL, WS_ENDPOINTS } from '../../../core/config';
import { StorageService } from '../../../core/storage';
import {
  ActiveWorker,
  AlertCounts,
  BiometricsByArea,
  RecentAlert,
  DashboardData,
} from '../types';
import { io, Socket } from 'socket.io-client';

/**
 * Servicio del dashboard con soporte para WebSockets
 */
export class DashboardService {
  private static socket: Socket | null = null;

  /**
   * Obtiene los trabajadores activos
   */
  static async getActiveWorkers(): Promise<ActiveWorker[]> {
    try {
      const backendData = await apiClient.get<any[]>(API_ENDPOINTS.ACTIVE_WORKERS);
      
      // Mapear los datos del backend (español) al formato del frontend (inglés)
      return backendData.map((worker: any) => ({
        user_id: worker.id,
        full_name: worker.nombre || 'N/A',
        employee_number: worker.cascoId ? `#${worker.cascoId}` : 'N/A',
        area_name: worker.area || 'Sin área',
        shift_name: 'Activo', // El backend no devuelve el turno actualmente
        hours_worked: worker.tiempoActivo ? worker.tiempoActivo / 3600 : 0, // Convertir segundos a horas
        avg_heart_rate: worker.ritmoCardiaco,
        avg_temperature: worker.temperaturaCorporal,
        last_reading_time: new Date().toISOString(), // El backend no devuelve esto actualmente
        battery_level: worker.nivelBateria,
      }));
    } catch (error) {
      console.error('Get active workers error:', error);
      throw error;
    }
  }

  /**
   * Obtiene el conteo de alertas
   */
  static async getAlertCounts(): Promise<AlertCounts> {
    try {
      const backendData = await apiClient.get<any>(API_ENDPOINTS.ALERT_COUNTS);
      
      // Mapear del formato backend (español) al frontend (inglés)
      return {
        critical: backendData.gasesToxicos + backendData.caidasImpactos, // Combinar críticas
        warning: backendData.ritmoCardiacoAnormal + backendData.temperaturaCorporalAlta, // Combinar advertencias
        info: 0, // El backend no devuelve info, por ahora 0
      };
    } catch (error) {
      console.error('Get alert counts error:', error);
      throw error;
    }
  }

  /**
   * Obtiene las biométricas por área
   */
  static async getBiometricsByArea(): Promise<BiometricsByArea[]> {
    try {
      const backendData = await apiClient.get<any>(API_ENDPOINTS.BIOMETRICS_BY_AREA);
      
      // El backend devuelve: { areas: [], ritmoCardiaco: [], temperaturaCorporal: [] }
      // Convertir a array de objetos
      const result: BiometricsByArea[] = [];
      
      if (backendData.areas && Array.isArray(backendData.areas)) {
        for (let i = 0; i < backendData.areas.length; i++) {
          result.push({
            area_name: backendData.areas[i],
            avg_heart_rate: backendData.ritmoCardiaco[i] || 0,
            avg_temperature: backendData.temperaturaCorporal[i] || 0,
            worker_count: 0, // El backend no devuelve este dato en este endpoint
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error('Get biometrics by area error:', error);
      throw error;
    }
  }

  /**
   * Obtiene las alertas recientes
   */
  static async getRecentAlerts(): Promise<RecentAlert[]> {
    try {
      const backendData = await apiClient.get<any[]>(API_ENDPOINTS.RECENT_ALERTS);
      
      // Mapear del formato backend (español) al frontend (inglés)
      return backendData.map((alert: any) => ({
        id: alert.id,
        alert_type: alert.tipo || 'Desconocido',
        severity: alert.severidad || 'info',
        message: `${alert.tipo}: ${alert.valor.toFixed(2)}`,
        created_at: alert.timestamp,
        user_full_name: alert.trabajador || 'N/A',
        area_name: alert.area || 'Sin área',
      }));
    } catch (error) {
      console.error('Get recent alerts error:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los datos del dashboard
   */
  static async getDashboardData(): Promise<DashboardData> {
    try {
      const [active_workers, alert_counts, biometrics_by_area, recent_alerts] =
        await Promise.all([
          this.getActiveWorkers(),
          this.getAlertCounts(),
          this.getBiometricsByArea(),
          this.getRecentAlerts(),
        ]);

      return {
        active_workers,
        alert_counts,
        biometrics_by_area,
        recent_alerts,
      };
    } catch (error) {
      console.error('Get dashboard data error:', error);
      throw error;
    }
  }

  /**
   * Conecta al WebSocket del dashboard para actualizaciones en tiempo real
   */
  static async connectWebSocket(
    onUpdate: (data: Partial<DashboardData>) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    try {
      const token = await StorageService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Crear conexión WebSocket
      this.socket = io(WS_BASE_URL + WS_ENDPOINTS.DASHBOARD, {
        auth: {
          token: token,
        },
        transports: ['websocket'],
      });

      // Eventos del WebSocket
      this.socket.on('connect', () => {
        console.log('WebSocket connected');
      });

      this.socket.on('dashboard_update', (data: Partial<DashboardData>) => {
        console.log('Dashboard update received:', data);
        onUpdate(data);
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      this.socket.on('error', (error: any) => {
        console.error('WebSocket error:', error);
        if (onError) {
          onError(error);
        }
      });
    } catch (error) {
      console.error('WebSocket connection error:', error);
      if (onError) {
        onError(error);
      }
    }
  }

  /**
   * Desconecta el WebSocket
   */
  static disconnectWebSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

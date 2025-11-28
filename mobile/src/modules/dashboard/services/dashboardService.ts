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
      return await apiClient.get<ActiveWorker[]>(API_ENDPOINTS.ACTIVE_WORKERS);
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
      return await apiClient.get<AlertCounts>(API_ENDPOINTS.ALERT_COUNTS);
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
      return await apiClient.get<BiometricsByArea[]>(API_ENDPOINTS.BIOMETRICS_BY_AREA);
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
      return await apiClient.get<RecentAlert[]>(API_ENDPOINTS.RECENT_ALERTS);
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

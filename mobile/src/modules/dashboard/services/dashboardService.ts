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
import { RealtimeAlert } from '../types/alert.types';

/**
 * Servicio del dashboard con soporte para WebSockets
 */
export class DashboardService {
  private static ws: WebSocket | null = null;
  private static reconnectTimer: NodeJS.Timeout | null = null;
  private static shouldReconnect: boolean = true;

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
        employee_number: worker.numeroEmpleado || 'N/A',
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
      
      // El backend ahora devuelve un solo objeto: { area, ritmoCardiaco, temperaturaCorporal, workerCount }
      // Convertir a array con un solo elemento para mantener compatibilidad
      const result: BiometricsByArea[] = [];
      
      if (backendData && backendData.area) {
        result.push({
          area_name: backendData.area,
          avg_heart_rate: backendData.ritmoCardiaco || 0,
          avg_temperature: backendData.temperaturaCorporal || 0,
          worker_count: backendData.workerCount || 0,
        });
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
      return backendData.map((alert: any) => {
        // Validar que los campos requeridos existan
        if (!alert.user_id || !alert.reading_id) {
          console.warn('Alerta con campos faltantes:', alert);
        }
        
        return {
          id: alert.id,
          alert_type: alert.tipo || 'Desconocido',
          severity: alert.severidad || 'info',
          message: alert.mensaje || `${alert.tipo}: ${alert.valor?.toFixed(2) || 'N/A'}`,
          created_at: alert.timestamp,
          user_full_name: alert.trabajador || 'N/A',
          user_id: alert.user_id,
          area_name: alert.area || 'Sin área',
          reading_id: alert.reading_id,
          device_id: alert.device_id,
        };
      });
    } catch (error) {
      console.error('Get recent alerts error:', error);
      throw error;
    }
  }

  /**
   * Obtiene los incidentes del supervisor
   */
  static async getIncidents(): Promise<any[]> {
    try {
      const incidents = await apiClient.get<any[]>(API_ENDPOINTS.INCIDENTS);
      return incidents;
    } catch (error) {
      console.error('Get incidents error:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los datos del dashboard
   */
  static async getDashboardData(): Promise<any> {
    try {
      const [active_workers, alert_counts, biometrics_by_area, recent_alerts, area_biometrics, incidents] =
        await Promise.all([
          this.getActiveWorkers(),
          this.getAlertCounts(),
          this.getBiometricsByArea(),
          this.getRecentAlerts(),
          apiClient.get<any>(API_ENDPOINTS.BIOMETRICS_BY_AREA),
          this.getIncidents(),
        ]);

      return {
        active_workers,
        alert_counts,
        biometrics_by_area,
        recent_alerts,
        area_biometrics,
        incidents,
      };
    } catch (error) {
      console.error('Get dashboard data error:', error);
      throw error;
    }
  }

  /**
   * Conecta al WebSocket de alertas para actualizaciones en tiempo real
   */
  static connectWebSocket(
    onAlert: (alert: RealtimeAlert) => void,
    onError?: (error: any) => void
  ): void {
    try {
      this.shouldReconnect = true;
      
      // Si ya hay una conexión, cerrarla
      if (this.ws) {
        this.ws.close();
      }

      // Generar un ID único para este cliente
      const clientId = `tablet_${Date.now()}`;
      const wsUrl = `${WS_BASE_URL}${WS_ENDPOINTS.ALERTS}?client_id=${clientId}`;

      console.log('Conectando a WebSocket:', wsUrl);
      this.ws = new WebSocket(wsUrl);

      // Evento: Conexión establecida
      this.ws.onopen = () => {
        console.log('WebSocket conectado');
        
        // Limpiar timer de reconexión si existe
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      // Evento: Mensaje recibido
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WebSocket mensaje recibido:', message);

          // Si es una alerta, procesarla
          if (message.type === 'alert' && message.data) {
            onAlert(message.data as RealtimeAlert);
          }
        } catch (error) {
          console.error('Error al parsear mensaje de WebSocket:', error);
        }
      };

      // Evento: Error
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) {
          onError(error);
        }
      };

      // Evento: Conexión cerrada
      this.ws.onclose = (event) => {
        console.log('WebSocket desconectado', event.code, event.reason);
        this.ws = null;

        // Intentar reconectar después de 3 segundos si shouldReconnect está activo
        if (this.shouldReconnect) {
          console.log('Intentando reconectar en 3 segundos...');
          this.reconnectTimer = setTimeout(() => {
            this.connectWebSocket(onAlert, onError);
          }, 3000);
        }
      };
    } catch (error) {
      console.error('Error al conectar WebSocket:', error);
      if (onError) {
        onError(error);
      }
    }
  }

  /**
   * Desconecta el WebSocket
   */
  static disconnectWebSocket(): void {
    this.shouldReconnect = false;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    console.log('WebSocket desconectado manualmente');
  }
}

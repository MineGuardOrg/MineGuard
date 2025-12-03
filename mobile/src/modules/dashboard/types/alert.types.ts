/**
 * Tipos para el sistema de alertas en tiempo real
 */

export type AlertSeverity = 'warning' | 'critical';

export interface RealtimeAlert {
  id: number;
  type: string;
  severity: AlertSeverity;
  worker_name: string;
  area: string | null;
  value: number;
  timestamp: string;
  message: string;
}

export interface AlertThresholds {
  temperature: {
    warning: number;  // 38.4°C
    critical: number; // 39.2°C
  };
  heartRate: {
    high_warning: number;   // 130 bpm
    high_critical: number;  // 140 bpm
    low_warning: number;    // 50 bpm
    low_critical: number;   // 45 bpm
  };
  co: {
    warning: number;   // 50 ppm
    critical: number;  // 100 ppm
  };
}

export const ALERT_THRESHOLDS: AlertThresholds = {
  temperature: {
    warning: 38.4,
    critical: 39.2,
  },
  heartRate: {
    high_warning: 130,
    high_critical: 140,
    low_warning: 50,
    low_critical: 45,
  },
  co: {
    warning: 50,
    critical: 100,
  },
};

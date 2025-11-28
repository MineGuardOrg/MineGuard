/**
 * Tipos del módulo de dashboard
 */

export interface ActiveWorker {
  user_id: number;
  full_name: string;
  employee_number: string;
  area_name: string;
  shift_name: string;
  hours_worked: number;
  avg_heart_rate: number;
  avg_temperature: number;
  last_reading_time: string;
}

export interface AlertCounts {
  critical: number;
  warning: number;
  info: number;
}

export interface BiometricsByArea {
  area_name: string;
  avg_heart_rate: number;
  avg_temperature: number;
  worker_count: number;
}

export interface RecentAlert {
  id: number;
  alert_type: string;
  severity: string;
  message: string;
  created_at: string;
  user_full_name: string;
  area_name: string;
}

export interface DashboardData {
  active_workers: ActiveWorker[];
  alert_counts: AlertCounts;
  biometrics_by_area: BiometricsByArea[];
  recent_alerts: RecentAlert[];
}

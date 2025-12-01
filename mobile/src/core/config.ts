/**
 * Configuración global de la aplicación
 */

export const API_BASE_URL = 'http://192.168.100.18:8000';
export const WS_BASE_URL = 'ws://localhost:8000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  
  // Dashboard
  ACTIVE_WORKERS: '/dashboard/active-workers',
  ALERT_COUNTS: '/dashboard/alerts/last-month-by-type',
  BIOMETRICS_BY_AREA: '/dashboard/biometrics/avg-by-area',
  RECENT_ALERTS: '/dashboard/alerts/recent',
} as const;

export const WS_ENDPOINTS = {
  DASHBOARD: '/ws/dashboard',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@mineguard:auth_token',
  USER_DATA: '@mineguard:user_data',
} as const;

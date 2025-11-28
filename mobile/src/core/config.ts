/**
 * Configuración global de la aplicación
 */

// TODO: Cambiar esta URL por la URL de tu backend en producción
export const API_BASE_URL = 'http://localhost:8000';
export const WS_BASE_URL = 'ws://localhost:8000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  
  // Dashboard
  ACTIVE_WORKERS: '/dashboard/active-workers',
  ALERT_COUNTS: '/dashboard/alert-counts',
  BIOMETRICS_BY_AREA: '/dashboard/biometrics-by-area',
  RECENT_ALERTS: '/dashboard/recent-alerts',
} as const;

export const WS_ENDPOINTS = {
  DASHBOARD: '/ws/dashboard',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@mineguard:auth_token',
  USER_DATA: '@mineguard:user_data',
} as const;

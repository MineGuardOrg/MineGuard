/**
 * Configuración global de la aplicación
 */

export const API_BASE_URL = 'https://mineguard-api-staging-fxhyfyanhacjf7g5.mexicocentral-01.azurewebsites.net';
export const WS_BASE_URL = 'wss://mineguard-api-staging-fxhyfyanhacjf7g5.mexicocentral-01.azurewebsites.net';

// export const API_BASE_URL = 'http://192.168.100.18:8000';
// export const WS_BASE_URL = 'ws://192.168.100.18:8000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  
  // Dashboard
  ACTIVE_WORKERS: '/dashboard/supervisor/active-workers',
  ALERT_COUNTS: '/dashboard/alerts/last-month-by-type',
  BIOMETRICS_BY_AREA: '/dashboard/supervisor/biometrics/avg-by-area',
  RECENT_ALERTS: '/dashboard/supervisor/alerts/recent',
  CREATE_INCIDENT: '/dashboard/supervisor/incident',
  ASSIGNED_USERS: '/dashboard/supervisor/assigned-users',
  INCIDENTS: '/dashboard/supervisor/incidents',
} as const;

export const WS_ENDPOINTS = {
  ALERTS: '/ws/alerts',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@mineguard:auth_token',
  USER_DATA: '@mineguard:user_data',
} as const;

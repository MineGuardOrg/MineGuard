/**
 * Tipos globales de la aplicación
 */

export interface User {
  id: number;
  employee_number: string;
  email: string;
  full_name: string;
  is_active: boolean;
  role_id: number;
  role?: Role;
}

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface ApiError {
  message: string;
  status?: number;
  detail?: any;
}

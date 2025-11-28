/**
 * Tipos del módulo de autenticación
 */

export interface LoginRequest {
  employee_number: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    employee_number: string;
    email: string;
    full_name: string;
    is_active: boolean;
    role_id: number;
  };
}

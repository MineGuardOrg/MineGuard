/**
 * Tipos del módulo de perfil
 */

export interface UserProfile {
  id: number;
  employee_number: string;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
  area_id: number | null;
  position_id: number | null;
  supervisor_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

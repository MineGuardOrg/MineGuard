import { apiClient } from '../../../core/api';
import { API_ENDPOINTS } from '../../../core/config';
import { StorageService } from '../../../core/storage';
import { LoginRequest } from '../types';

// Definición local del tipo de respuesta de login
interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
}
import { User } from '../../../types';

/**
 * Servicio de autenticación
 */
export class AuthService {
  /**
   * Inicia sesión con número de empleado y contraseña
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {

      // Enviar body como JSON
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.LOGIN,
        {
          employee_number: credentials.employee_number,
          password: credentials.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Guardar token y rol
      await StorageService.saveToken(response.access_token);
      if (response.role) {
        await StorageService.saveUserData({ role: response.role });
      } else {
        await StorageService.removeUserData();
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Cierra la sesión actual
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Limpiar storage siempre, aunque falle la petición
      await StorageService.clear();
    }
  }

  /**
   * Obtiene el usuario actual
   */
  static async getCurrentUser(): Promise<User> {
    try {
      return await apiClient.get<User>(API_ENDPOINTS.ME);
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  /**
   * Verifica si hay una sesión activa
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await StorageService.getToken();
      return token !== null && token !== undefined && token !== '';
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }
}

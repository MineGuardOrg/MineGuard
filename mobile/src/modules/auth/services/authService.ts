import { apiClient } from '../../../core/api';
import { API_ENDPOINTS } from '../../../core/config';
import { StorageService } from '../../../core/storage';
import { LoginRequest, LoginResponse } from '../types';
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
      // Crear FormData para enviar credenciales
      const formData = new FormData();
      formData.append('username', credentials.employee_number);
      formData.append('password', credentials.password);

      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.LOGIN,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      // Guardar token y datos de usuario
      await StorageService.saveToken(response.access_token);
      await StorageService.saveUserData(response.user);

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
    const token = await StorageService.getToken();
    return !!token;
  }
}

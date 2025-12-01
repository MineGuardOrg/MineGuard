import { apiClient } from '../../../core/api';
import { UserProfile } from '../types';

/**
 * Servicio para operaciones de perfil de usuario
 */
class ProfileService {
  /**
   * Obtiene la información del usuario autenticado
   */
  async getCurrentUserProfile(): Promise<UserProfile> {
    try {
      const data = await apiClient.get<UserProfile>('/auth/me');
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
}

export default new ProfileService();

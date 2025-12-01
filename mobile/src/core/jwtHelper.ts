/**
 * Helper para decodificar tokens JWT sin verificación
 * (La verificación se hace en el backend)
 */

interface DecodedToken {
  sub: string;
  role: string;
  name?: string;
  last_name?: string;
  exp?: number;
  iat?: number;
}

export class JWTHelper {
  /**
   * Decodifica un token JWT sin verificar la firma
   */
  static decode(token: string): DecodedToken | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      // Decodificar la parte del payload (parte 1)
      const payload = parts[1];
      const decoded = this.base64UrlDecode(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  /**
   * Decodifica una cadena base64url
   */
  private static base64UrlDecode(str: string): string {
    // Reemplazar caracteres específicos de base64url
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Agregar padding si es necesario
    const pad = base64.length % 4;
    if (pad) {
      if (pad === 1) {
        throw new Error('Invalid base64url string');
      }
      base64 += new Array(5 - pad).join('=');
    }

    // Decodificar base64
    return atob(base64);
  }

  /**
   * Verifica si un token ha expirado
   */
  static isExpired(token: string): boolean {
    const decoded = this.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const now = Date.now() / 1000;
    return decoded.exp < now;
  }

  /**
   * Obtiene el nombre completo del usuario del token
   */
  static getUserFullName(token: string): string {
    const decoded = this.decode(token);
    if (!decoded) {
      return 'Usuario';
    }

    const name = decoded.name || '';
    const lastName = decoded.last_name || '';
    
    if (name && lastName) {
      return `${name} ${lastName}`;
    }
    
    return name || lastName || 'Usuario';
  }

  /**
   * Obtiene el rol del usuario del token
   */
  static getUserRole(token: string): string | null {
    const decoded = this.decode(token);
    return decoded?.role || null;
  }

  /**
   * Obtiene el ID del usuario del token
   */
  static getUserId(token: string): string | null {
    const decoded = this.decode(token);
    return decoded?.sub || null;
  }
}

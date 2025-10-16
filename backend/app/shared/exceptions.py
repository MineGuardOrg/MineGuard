# Excepciones personalizadas para la aplicación
from typing import Optional, Dict, Any

class MineGuardException(Exception):
    """Excepción base para la aplicación MineGuard"""
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.details = details or {}
        super().__init__(self.message)

class ValidationError(MineGuardException):
    """Excepción para errores de validación de datos"""
    pass

class NotFoundError(MineGuardException):
    """Excepción para cuando un recurso no se encuentra"""
    pass

class DuplicateError(MineGuardException):
    """Excepción para cuando se intenta crear un recurso duplicado"""
    pass

class AuthenticationError(MineGuardException):
    """Excepción para errores de autenticación"""
    pass

class AuthorizationError(MineGuardException):
    """Excepción para errores de autorización"""
    pass

class DatabaseError(MineGuardException):
    """Excepción para errores de base de datos"""
    pass

class ExternalServiceError(MineGuardException):
    """Excepción para errores en servicios externos"""
    pass

class BusinessLogicError(MineGuardException):
    """Excepción para errores de lógica de negocio"""
    pass
# Archivo __init__.py para el módulo shared
from .base_repository import BaseRepository
from .base_service import BaseService
from .exceptions import (
    MineGuardException,
    ValidationError,
    NotFoundError,
    DuplicateError,
    AuthenticationError,
    AuthorizationError,
    DatabaseError,
    ExternalServiceError,
    BusinessLogicError
)

__all__ = [
    "BaseRepository",
    "BaseService",
    "MineGuardException",
    "ValidationError",
    "NotFoundError", 
    "DuplicateError",
    "AuthenticationError",
    "AuthorizationError",
    "DatabaseError",
    "ExternalServiceError",
    "BusinessLogicError"
]
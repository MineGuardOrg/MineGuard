# Archivo __init__.py para el módulo role
from .models import (
    # Entidad SQLAlchemy
    Role,
    # Schemas Pydantic
    RoleCreateSchema,
    RoleUpdateSchema,
    RoleSchema
)
from .repository import RoleRepository
from .service import RoleService
from .router import role_router

__all__ = [
    # Models & Entity
    "Role",
    "RoleCreateSchema",
    "RoleUpdateSchema", 
    "RoleSchema",
    # Repository
    "RoleRepository",
    # Service
    "RoleService",
    # Router
    "role_router"
]
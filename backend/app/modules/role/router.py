# Router del módulo Role
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional, TYPE_CHECKING
from app.modules.role.models import (
    RoleCreateSchema,
    RoleUpdateSchema,
    RoleSchema
)
from app.modules.role.service import RoleService
from app.core.security import get_current_user

# Evitar importación circular usando TYPE_CHECKING
if TYPE_CHECKING:
    from app.modules.auth.models import User

# Crear instancia del router
role_router = APIRouter()

# Instancia del servicio
role_service = RoleService()

@role_router.get("/", response_model=List[RoleSchema])
def get_all_roles(current_user = Depends(get_current_user)):
    """Obtiene todos los roles activos"""
    return role_service.get_all()

@role_router.get("/{role_id}", response_model=RoleSchema)
def get_role_by_id(role_id: int, current_user = Depends(get_current_user)):
    """Obtiene un rol por ID"""
    return role_service.get_by_id(role_id)

@role_router.post("/", response_model=RoleSchema, status_code=status.HTTP_201_CREATED)
def create_role(role_data: RoleCreateSchema, current_user = Depends(get_current_user)):
    """Crea un nuevo rol"""
    return role_service.create(role_data)

@role_router.put("/{role_id}", response_model=RoleSchema)
def update_role(role_id: int, role_data: RoleUpdateSchema, current_user = Depends(get_current_user)):
    """Actualiza un rol existente"""
    return role_service.update(role_id, role_data)

@role_router.delete("/{role_id}")
def delete_role(role_id: int, current_user = Depends(get_current_user)):
    """Elimina un rol (soft delete)"""
    return role_service.delete(role_id)
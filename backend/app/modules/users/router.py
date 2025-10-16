# Router del módulo Users
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.modules.users.models import (
    UserSchema,
    UserUpdateSchema,
    User
)
from app.modules.users.service import UserService
from app.core.security import get_current_user

# Crear instancia del router
user_router = APIRouter()

# Instancia del servicio
user_service = UserService()

@user_router.get("/getall", response_model=List[UserSchema])
def get_all_users(
    current_user: User = Depends(get_current_user)
):
    """Obtiene todos los usuarios activos"""
    return user_service.get_all()

@user_router.get("/getbyid/{user_id}", response_model=UserSchema)
def get_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_user)
):
    """Obtiene un usuario por ID"""
    return user_service.get_by_id(user_id)

@user_router.put("/update/{user_id}", response_model=UserSchema)
def update_user(
    user_id: int,
    user_data: UserUpdateSchema,
    current_user: User = Depends(get_current_user)
):
    """Actualiza un usuario existente"""
    return user_service.update(user_id, user_data)

@user_router.delete("/delete/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Depends(get_current_user)
):
    """Elimina un usuario (soft delete - cambia is_active a 0)"""
    return user_service.soft_delete(user_id)
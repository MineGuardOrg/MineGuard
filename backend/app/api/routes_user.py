# Endpoints de usuarios

from fastapi import APIRouter, HTTPException, Depends
from app.application.user_service import UserService
from app.domain.schemas.user_schema import UserSchema, UserCreateSchema
from app.domain.entities.user import User
from app.core.security import get_current_user

user_router = APIRouter()

@user_router.get("/", response_model=list[UserSchema])
def get_all_users(current_user: User = Depends(get_current_user)):
    """Obtener todos los usuarios (requiere autenticación)"""
    return UserService.get_all_users()

@user_router.get("/{user_id}", response_model=UserSchema)
def get_user(user_id: int):
    user = UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@user_router.post("/", response_model=UserSchema)
def create_user(user: UserCreateSchema):
    user_dict = user.dict()
    new_user = UserService.create_user(user_dict)
    return new_user

@user_router.delete("/{user_id}")
def delete_user(user_id: int):
    result = UserService.soft_delete_user(user_id)
    if not result:
        raise HTTPException(status_code=404, detail="Usuario no encontrado o ya eliminado")
    return {"message": "Usuario eliminado (soft delete)"}

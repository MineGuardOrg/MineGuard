# Router del módulo Auth
from fastapi import APIRouter, Depends, HTTPException, status
from app.modules.auth.models import (
    User, 
    LoginSchema, 
    TokenResponse, 
    UserRegisterSchema, 
    UserSchema
)
from app.modules.auth.service import AuthService
from app.core.security import get_current_user

# Crear instancia del router
auth_router = APIRouter()

# Instancia del servicio
auth_service = AuthService()

@auth_router.post("/register", response_model=UserSchema)
def register(user_data: UserRegisterSchema):
    """Registra un nuevo usuario"""
    return auth_service.register(user_data)

@auth_router.post("/login", response_model=TokenResponse)
def login(credentials: LoginSchema):
    """Inicia sesión y devuelve un JWT token"""
    return auth_service.login(credentials)

@auth_router.get("/me", response_model=UserSchema)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Obtiene información del usuario actual autenticado"""
    return auth_service.get_current_user_info(current_user.id)

# Función opcional para obtener usuario actual (puede retornar None)
def get_optional_current_user(token: str = None):
    """Obtiene el usuario actual si el token es válido, sino retorna None"""
    try:
        from app.core.security import oauth2_scheme
        from jose import jwt, JWTError
        from app.core.config import settings
        
        if not token:
            return None
            
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
            
        # Obtener usuario
        user = auth_service.repository.get_by_id(int(user_id))
        return user
        
    except (JWTError, ValueError):
        return None
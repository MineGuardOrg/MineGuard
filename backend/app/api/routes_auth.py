# Endpoints de autenticación
from fastapi import APIRouter, HTTPException, status, Depends, Header, Request
from app.domain.schemas.auth_schema import LoginSchema, TokenResponse
from app.domain.schemas.user_schema import UserRegisterSchema, UserSchema
from app.domain.entities.user import User
from app.application.auth_service import AuthService
from app.core.security import get_current_user

auth_router = APIRouter()

@auth_router.post("/register", response_model=UserSchema)
def register(user_data: UserRegisterSchema):
    """Registra un nuevo usuario"""
    return AuthService.register(user_data)

@auth_router.post("/login", response_model=TokenResponse)
def login(credentials: LoginSchema):
    """Inicia sesión y devuelve un JWT token"""
    
    # Autenticar usuario
    user = AuthService.authenticate(
        employee_number=credentials.employee_number,
        password=credentials.password
    )
    
    # Crear y devolver token
    return AuthService.create_token(user)

@auth_router.get("/me", response_model=UserSchema)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Obtiene información del usuario actual autenticado"""
    return UserSchema.from_orm(current_user)

def get_optional_current_user(token: str = Depends(lambda: None)):
    """Obtiene el usuario actual si el token es válido, sino retorna None"""
    from app.core.security import oauth2_scheme
    from jose import jwt, JWTError
    from app.core.config import settings
    from app.infrastructure.dao.user_dao import UserDAO
    
    try:
        # Intentar obtener token del header Authorization
        from fastapi import Request
        # El token será None si no se proporciona
        if not token:
            return None
            
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
            
        user = UserDAO.get_by_id(int(user_id))
        return user
    except (JWTError, Exception):
        return None

@auth_router.post("/logout")
def logout():
    """Cierra sesión del usuario - Logout simple"""
    import logging
    
    logger = logging.getLogger(__name__)
    
    # Por ahora, logout simple sin mostrar employee_number
    # El token expira automáticamente en 24 horas
    logger.info("🚪 Logout ejecutado")
    
    return {"message": "Sesión cerrada exitosamente"}

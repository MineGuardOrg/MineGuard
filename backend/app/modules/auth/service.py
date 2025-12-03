# Servicio del módulo Auth
import logging
from typing import Dict, Any
from fastapi import HTTPException, status

from app.shared.base_service import BaseService
from app.shared.exceptions import ValidationError, DuplicateError, AuthenticationError
from app.modules.auth.models import (
    User, 
    UserCreateSchema, 
    UserRegisterSchema, 
    UserSchema, 
    UserUpdateSchema,
    LoginSchema,
    TokenResponse
)
from app.modules.users.models import UserDetailSchema
from app.modules.auth.repository import AuthRepository
from app.core.security import get_password_hash, verify_password, create_access_token

logger = logging.getLogger(__name__)

class AuthService(BaseService[User, UserCreateSchema, UserUpdateSchema, UserSchema]):
    """Servicio de autenticación y gestión de usuarios"""
    
    def __init__(self):
        self.repository = AuthRepository()
        super().__init__(self.repository)
    
    def _validate_create_data(self, data: UserCreateSchema) -> Dict[str, Any]:
        """Valida datos para crear usuario"""
        user_data = data.dict()
        
        # Verificar duplicados
        if self.repository.employee_number_exists(user_data["employee_number"]):
            raise DuplicateError("El número de empleado ya está registrado")
        
        if self.repository.email_exists(user_data["email"]):
            raise DuplicateError("El email ya está registrado")
        
        # Hashear contraseña
        user_data["password"] = get_password_hash(user_data["password"])
        
        # Limpiar campos opcionales
        optional_fields = ["area_id", "position_id", "supervisor_id"]
        for field in optional_fields:
            if user_data.get(field) == 0:
                user_data[field] = None
        
        return user_data
    
    def _validate_update_data(self, id: int, data: UserUpdateSchema) -> Dict[str, Any]:
        """Valida datos para actualizar usuario"""
        user_data = {k: v for k, v in data.dict().items() if v is not None}
        
        # Verificar duplicados (excluyendo el usuario actual)
        if "employee_number" in user_data:
            if self.repository.employee_number_exists(user_data["employee_number"], exclude_id=id):
                raise DuplicateError("El número de empleado ya está registrado")
        
        if "email" in user_data:
            if self.repository.email_exists(user_data["email"], exclude_id=id):
                raise DuplicateError("El email ya está registrado")
        
        # Hashear contraseña si se proporciona
        if "password" in user_data:
            user_data["password"] = get_password_hash(user_data["password"])
        
        # Limpiar campos opcionales
        optional_fields = ["area_id", "position_id", "supervisor_id"]
        for field in optional_fields:
            if user_data.get(field) == 0:
                user_data[field] = None
        
        return user_data
    
    def _to_response_schema(self, entity: User) -> UserSchema:
        """Convierte entidad User a UserSchema"""
        return UserSchema.from_orm(entity)
    
    # ==================== MÉTODOS ESPECÍFICOS DE AUTH ====================
    
    def register(self, user_data: UserRegisterSchema) -> UserSchema:
        """Registra un nuevo usuario con validaciones específicas"""
        try:
            # Convertir a UserCreateSchema con valores por defecto
            user_dict = user_data.dict()
            # Asegurarse de que role_id tenga un valor por defecto
            if user_dict.get("role_id") is None:
                user_dict["role_id"] = 2  # Role "User" por defecto
            
            create_data = UserCreateSchema(**user_dict)
            
            # Usar el método create heredado
            user_schema = self.create(create_data)
            
            logger.info(f"Usuario registrado exitosamente - Employee: {user_data.employee_number}")
            return user_schema
            
        except (ValidationError, DuplicateError) as e:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=str(e)
            )
        except Exception as e:
            logger.error(f"Error al registrar usuario: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al registrar usuario"
            )
    
    def authenticate(self, employee_number: str, password: str) -> User:
        """Autentica un usuario por employee_number y password"""
        try:
            # Buscar usuario por employee_number
            user = self.repository.get_by_employee_number(employee_number)
            if not user:
                raise AuthenticationError("Credenciales incorrectas")
            
            # Verificar contraseña
            if not verify_password(password, user.password):
                raise AuthenticationError("Credenciales incorrectas")
            
            logger.info(f"Login exitoso - Employee: {user.employee_number}")
            return user
            
        except AuthenticationError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=str(e)
            )
        except Exception as e:
            logger.error(f"Error al autenticar usuario: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al autenticar usuario"
            )
    
    def login(self, credentials: LoginSchema) -> TokenResponse:
        """Proceso completo de login: autenticar y generar token"""
        try:
            # Autenticar usuario
            user = self.authenticate(credentials.employee_number, credentials.password)
            
            # Generar token con información del usuario
            token_data = {
                "sub": str(user.id),
                "role": user.role.name,
                "name": user.first_name,
                "last_name": user.last_name
            }
            access_token = create_access_token(data=token_data)
            
            return TokenResponse(
                access_token=access_token,
                token_type="bearer",
                role=user.role.name  # Incluir el rol en la respuesta
            )
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error en proceso de login: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor en el proceso de login"
            )
    
    def get_current_user_info(self, user_id: int) -> UserDetailSchema:
        """Obtiene información detallada del usuario actual con nombres de área y posición"""
        from app.core.database import SessionLocal
        from app.modules.area.models import Area
        from app.modules.position.models import Position
        
        with SessionLocal() as db:
            result = (
                db.query(
                    User.id,
                    User.employee_number,
                    User.first_name,
                    User.last_name,
                    User.email,
                    User.role_id,
                    User.area_id,
                    Area.name.label('area_name'),
                    User.position_id,
                    Position.name.label('position_name'),
                    User.supervisor_id,
                    User.is_active,
                    User.created_at,
                    User.updated_at
                )
                .outerjoin(Area, Area.id == User.area_id)
                .outerjoin(Position, Position.id == User.position_id)
                .filter(User.id == user_id)
                .first()
            )
            
            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Usuario no encontrado"
                )
            
            return UserDetailSchema(
                id=result.id,
                employee_number=result.employee_number,
                first_name=result.first_name,
                last_name=result.last_name,
                email=result.email,
                role_id=result.role_id,
                area_id=result.area_id,
                area_name=result.area_name,
                position_id=result.position_id,
                position_name=result.position_name,
                supervisor_id=result.supervisor_id,
                is_active=result.is_active,
                created_at=result.created_at,
                updated_at=result.updated_at
            )
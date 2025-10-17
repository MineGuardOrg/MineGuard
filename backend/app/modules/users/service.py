# Servicio del módulo Users
import logging
from typing import Dict, Any, List, Optional
from fastapi import HTTPException, status

from app.shared.base_service import BaseService
from app.shared.exceptions import ValidationError, DuplicateError, NotFoundError
from app.modules.users.models import (
    User,
    UserCreateSchema,
    UserSchema,
    UserUpdateSchema,
    UserListSchema
)
from app.modules.users.repository import UserRepository
from app.core.security import get_password_hash

logger = logging.getLogger(__name__)

class UserService(BaseService[User, UserCreateSchema, UserUpdateSchema, UserSchema]):
    """Servicio de gestión de usuarios"""
    
    def __init__(self):
        self.repository = UserRepository()
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
        
        # Si no se proporciona role_id, usar "User" por defecto (id=2)
        if user_data.get("role_id") is None:
            user_data["role_id"] = 2
            logger.info(f"Role asignado por defecto: User (id=2) para employee: {user_data['employee_number']}")
        
        # Limpiar campos opcionales
        optional_fields = ["area_id", "position_id", "supervisor_id"]
        for field in optional_fields:
            if user_data.get(field) == 0 or user_data.get(field) is None:
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
    
    # ==================== MÉTODOS ESPECÍFICOS DE USERS ====================
    
    def get_all_simple(self) -> List[UserListSchema]:
        """Obtiene todos los usuarios con schema simplificado"""
        try:
            entities = self.repository.get_all()
            return [UserListSchema.from_orm(entity) for entity in entities]
        except Exception as e:
            logger.error(f"Error al obtener usuarios simplificados: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al obtener usuarios"
            )
    
    def get_by_employee_number(self, employee_number: str) -> UserSchema:
        """Obtiene un usuario por número de empleado"""
        try:
            user = self.repository.get_by_employee_number(employee_number)
            if not user:
                raise NotFoundError(f"Usuario con employee_number {employee_number} no encontrado")
            return self._to_response_schema(user)
        except NotFoundError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        except Exception as e:
            logger.error(f"Error al obtener usuario por employee_number {employee_number}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al obtener usuario"
            )
    
    def get_by_email(self, email: str) -> UserSchema:
        """Obtiene un usuario por email"""
        try:
            user = self.repository.get_by_email(email)
            if not user:
                raise NotFoundError(f"Usuario con email {email} no encontrado")
            return self._to_response_schema(user)
        except NotFoundError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        except Exception as e:
            logger.error(f"Error al obtener usuario por email {email}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al obtener usuario"
            )
    
    def get_by_role(self, role_id: int) -> List[UserSchema]:
        """Obtiene todos los usuarios por rol"""
        try:
            users = self.repository.get_by_role(role_id)
            return [self._to_response_schema(user) for user in users]
        except Exception as e:
            logger.error(f"Error al obtener usuarios por rol {role_id}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al obtener usuarios por rol"
            )
    
    def get_by_area(self, area_id: int) -> List[UserSchema]:
        """Obtiene todos los usuarios por área"""
        try:
            users = self.repository.get_by_area(area_id)
            return [self._to_response_schema(user) for user in users]
        except Exception as e:
            logger.error(f"Error al obtener usuarios por área {area_id}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al obtener usuarios por área"
            )
    
    def get_subordinates(self, supervisor_id: int) -> List[UserSchema]:
        """Obtiene todos los subordinados de un supervisor"""
        try:
            users = self.repository.get_subordinates(supervisor_id)
            return [self._to_response_schema(user) for user in users]
        except Exception as e:
            logger.error(f"Error al obtener subordinados del supervisor {supervisor_id}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al obtener subordinados"
            )
    
    def search_users(self, search_term: str) -> List[UserSchema]:
        """Busca usuarios por nombre, apellido o número de empleado"""
        try:
            if not search_term or len(search_term.strip()) < 2:
                raise ValidationError("El término de búsqueda debe tener al menos 2 caracteres")
            
            users = self.repository.search_users(search_term.strip())
            return [self._to_response_schema(user) for user in users]
        except ValidationError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        except Exception as e:
            logger.error(f"Error al buscar usuarios con término '{search_term}': {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al buscar usuarios"
            )
    
    def soft_delete(self, user_id: int) -> Dict[str, str]:
        """Elimina un usuario (soft delete) - cambia is_active a 0"""
        return self.delete(user_id)
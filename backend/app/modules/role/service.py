# Servicio del módulo Role
import logging
from typing import Dict, Any
from fastapi import HTTPException, status

from app.shared.base_service import BaseService
from app.shared.exceptions import ValidationError, DuplicateError
from app.modules.role.models import (
    Role, 
    RoleCreateSchema, 
    RoleUpdateSchema,
    RoleSchema
)
from app.modules.role.repository import RoleRepository

logger = logging.getLogger(__name__)

class RoleService(BaseService[Role, RoleCreateSchema, RoleUpdateSchema, RoleSchema]):
    """Servicio para gestión de roles"""
    
    def __init__(self):
        self.repository = RoleRepository()
        super().__init__(self.repository)
    
    def _validate_create_data(self, data: RoleCreateSchema) -> Dict[str, Any]:
        """Valida datos para crear rol"""
        role_data = data.dict()
        
        # Verificar duplicados
        if self.repository.name_exists(role_data["name"]):
            raise DuplicateError("El nombre del rol ya está registrado")
        
        return role_data
    
    def _validate_update_data(self, id: int, data: RoleUpdateSchema) -> Dict[str, Any]:
        """Valida datos para actualizar rol"""
        role_data = {k: v for k, v in data.dict().items() if v is not None}
        
        # Verificar duplicados (excluyendo el rol actual)
        if "name" in role_data:
            if self.repository.name_exists(role_data["name"], exclude_id=id):
                raise DuplicateError("El nombre del rol ya está registrado")
        
        return role_data
    
    def _to_response_schema(self, entity: Role) -> RoleSchema:
        """Convierte entidad Role a RoleSchema"""
        return RoleSchema.from_orm(entity)
# Servicio del módulo Area
import logging
from typing import Dict, Any
from fastapi import HTTPException, status

from app.shared.base_service import BaseService
from app.shared.exceptions import ValidationError, DuplicateError
from app.modules.area.models import (
    Area, 
    AreaCreateSchema, 
    AreaUpdateSchema,
    AreaSchema
)
from app.modules.area.repository import AreaRepository

logger = logging.getLogger(__name__)

class AreaService(BaseService[Area, AreaCreateSchema, AreaUpdateSchema, AreaSchema]):
    """Servicio para gestión de áreas"""
    
    def __init__(self):
        self.repository = AreaRepository()
        super().__init__(self.repository)
    
    def _validate_create_data(self, data: AreaCreateSchema) -> Dict[str, Any]:
        """Valida datos para crear área"""
        area_data = data.dict()
        
        # Verificar duplicados
        if self.repository.name_exists(area_data["name"]):
            raise DuplicateError("El nombre del área ya está registrado")
        
        return area_data
    
    def _validate_update_data(self, id: int, data: AreaUpdateSchema) -> Dict[str, Any]:
        """Valida datos para actualizar área"""
        area_data = {k: v for k, v in data.dict().items() if v is not None}
        
        # Verificar duplicados (excluyendo el área actual)
        if "name" in area_data:
            if self.repository.name_exists(area_data["name"], exclude_id=id):
                raise DuplicateError("El nombre del área ya está registrado")
        
        return area_data
    
    def _to_response_schema(self, entity: Area) -> AreaSchema:
        """Convierte entidad Area a AreaSchema"""
        return AreaSchema.from_orm(entity)
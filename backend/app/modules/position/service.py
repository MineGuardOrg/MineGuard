# Servicio del módulo Position
import logging
from typing import Dict, Any
from fastapi import HTTPException, status

from app.shared.base_service import BaseService
from app.shared.exceptions import ValidationError, DuplicateError
from app.modules.position.models import (
    Position, 
    PositionCreateSchema, 
    PositionUpdateSchema,
    PositionSchema
)
from app.modules.position.repository import PositionRepository

logger = logging.getLogger(__name__)

class PositionService(BaseService[Position, PositionCreateSchema, PositionUpdateSchema, PositionSchema]):
    """Servicio para gestión de posiciones"""
    
    def __init__(self):
        self.repository = PositionRepository()
        super().__init__(self.repository)
    
    def _validate_create_data(self, data: PositionCreateSchema) -> Dict[str, Any]:
        """Valida datos para crear posición"""
        position_data = data.dict()
        
        # Verificar duplicados
        if self.repository.name_exists(position_data["name"]):
            raise DuplicateError("El nombre de la posición ya está registrado")
        
        return position_data
    
    def _validate_update_data(self, id: int, data: PositionUpdateSchema) -> Dict[str, Any]:
        """Valida datos para actualizar posición"""
        position_data = {k: v for k, v in data.dict().items() if v is not None}
        
        # Verificar duplicados (excluyendo la posición actual)
        if "name" in position_data:
            if self.repository.name_exists(position_data["name"], exclude_id=id):
                raise DuplicateError("El nombre de la posición ya está registrado")
        
        return position_data
    
    def _to_response_schema(self, entity: Position) -> PositionSchema:
        """Convierte entidad Position a PositionSchema"""
        return PositionSchema.from_orm(entity)
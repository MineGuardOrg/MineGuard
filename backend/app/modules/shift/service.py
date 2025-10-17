# Servicio del módulo Shift
import logging
from typing import Dict, Any
from app.shared.base_service import BaseService
from app.modules.shift.models import Shift, ShiftCreateSchema, ShiftUpdateSchema, ShiftSchema
from app.modules.shift.repository import ShiftRepository

logger = logging.getLogger(__name__)


class ShiftService(BaseService[Shift, ShiftCreateSchema, ShiftUpdateSchema, ShiftSchema]):
    def __init__(self):
        self.repository = ShiftRepository()
        super().__init__(self.repository)

    def _validate_create_data(self, data: ShiftCreateSchema) -> Dict[str, Any]:
        return data.dict()

    def _validate_update_data(self, id: int, data: ShiftUpdateSchema) -> Dict[str, Any]:
        return {k: v for k, v in data.dict().items() if v is not None}

    def _to_response_schema(self, entity: Shift) -> ShiftSchema:
        return ShiftSchema.from_orm(entity)

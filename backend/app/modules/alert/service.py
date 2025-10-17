# Servicio del módulo Alert
import logging
from typing import Dict, Any, List
from fastapi import HTTPException, status

from app.shared.base_service import BaseService
from app.shared.exceptions import ValidationError
from app.modules.alert.models import Alert, AlertCreateSchema, AlertUpdateSchema, AlertSchema
from app.modules.alert.repository import AlertRepository

logger = logging.getLogger(__name__)


class AlertService(BaseService[Alert, AlertCreateSchema, AlertUpdateSchema, AlertSchema]):
    def __init__(self):
        self.repository = AlertRepository()
        super().__init__(self.repository)

    def _validate_create_data(self, data: AlertCreateSchema) -> Dict[str, Any]:
        return data.dict()

    def _validate_update_data(self, id: int, data: AlertUpdateSchema) -> Dict[str, Any]:
        return {k: v for k, v in data.dict().items() if v is not None}

    def _to_response_schema(self, entity: Alert) -> AlertSchema:
        return AlertSchema.from_orm(entity)

    def get_by_reading(self, reading_id: int) -> List[AlertSchema]:
        try:
            items = self.repository.get_by_reading(reading_id)
            return [self._to_response_schema(it) for it in items]
        except Exception as e:
            logger.error(f"Error al obtener alertas por lectura {reading_id}: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")

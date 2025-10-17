# Servicio del módulo Reading
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from fastapi import HTTPException, status

from app.shared.base_service import BaseService
from app.shared.exceptions import ValidationError
from app.modules.reading.models import Reading, ReadingCreateSchema, ReadingUpdateSchema, ReadingSchema
from app.modules.reading.repository import ReadingRepository

logger = logging.getLogger(__name__)


class ReadingService(BaseService[Reading, ReadingCreateSchema, ReadingUpdateSchema, ReadingSchema]):
    def __init__(self):
        self.repository = ReadingRepository()
        super().__init__(self.repository)

    def _validate_create_data(self, data: ReadingCreateSchema) -> Dict[str, Any]:
        payload = data.dict()
        if payload["sensor_id"] <= 0 or payload["user_id"] <= 0:
            raise ValidationError("sensor_id o user_id inválido")
        return payload

    def _validate_update_data(self, id: int, data: ReadingUpdateSchema) -> Dict[str, Any]:
        payload = {k: v for k, v in data.dict().items() if v is not None}
        if "sensor_id" in payload and payload["sensor_id"] <= 0:
            raise ValidationError("sensor_id inválido")
        if "user_id" in payload and payload["user_id"] <= 0:
            raise ValidationError("user_id inválido")
        return payload

    def _to_response_schema(self, entity: Reading) -> ReadingSchema:
        return ReadingSchema.from_orm(entity)

    def get_by_sensor(self, sensor_id: int, start: Optional[datetime] = None, end: Optional[datetime] = None) -> List[ReadingSchema]:
        try:
            items = self.repository.get_by_sensor(sensor_id, start, end)
            return [self._to_response_schema(it) for it in items]
        except Exception as e:
            logger.error(f"Error al obtener lecturas por sensor {sensor_id}: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")

    def get_by_user(self, user_id: int, limit: int = 100) -> List[ReadingSchema]:
        try:
            items = self.repository.get_by_user(user_id, limit)
            return [self._to_response_schema(it) for it in items]
        except Exception as e:
            logger.error(f"Error al obtener lecturas por usuario {user_id}: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")

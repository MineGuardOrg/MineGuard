# Servicio del módulo Sensor
import logging
from typing import Dict, Any, List
from fastapi import HTTPException, status

from app.shared.base_service import BaseService
from app.shared.exceptions import ValidationError
from app.modules.sensor.models import Sensor, SensorCreateSchema, SensorUpdateSchema, SensorSchema
from app.modules.sensor.repository import SensorRepository

logger = logging.getLogger(__name__)


class SensorService(BaseService[Sensor, SensorCreateSchema, SensorUpdateSchema, SensorSchema]):
    def __init__(self):
        self.repository = SensorRepository()
        super().__init__(self.repository)

    def _validate_create_data(self, data: SensorCreateSchema) -> Dict[str, Any]:
        payload = data.dict()
        if payload["device_id"] <= 0:
            raise ValidationError("device_id inválido")
        return payload

    def _validate_update_data(self, id: int, data: SensorUpdateSchema) -> Dict[str, Any]:
        payload = {k: v for k, v in data.dict().items() if v is not None}
        if "device_id" in payload and payload["device_id"] <= 0:
            raise ValidationError("device_id inválido")
        return payload

    def _to_response_schema(self, entity: Sensor) -> SensorSchema:
        return SensorSchema.from_orm(entity)

    def get_by_device(self, device_id: int) -> List[SensorSchema]:
        try:
            items = self.repository.get_by_device(device_id)
            return [self._to_response_schema(it) for it in items]
        except Exception as e:
            logger.error(f"Error al obtener sensores por dispositivo {device_id}: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")

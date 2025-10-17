# Servicio del módulo Device
import logging
from typing import Dict, Any, List
from fastapi import HTTPException, status

from app.shared.base_service import BaseService
from app.shared.exceptions import ValidationError
from app.modules.device.models import (
    Device,
    DeviceCreateSchema,
    DeviceUpdateSchema,
    DeviceSchema,
)
from app.modules.device.repository import DeviceRepository

logger = logging.getLogger(__name__)


class DeviceService(BaseService[Device, DeviceCreateSchema, DeviceUpdateSchema, DeviceSchema]):
    def __init__(self):
        self.repository = DeviceRepository()
        super().__init__(self.repository)

    def _validate_create_data(self, data: DeviceCreateSchema) -> Dict[str, Any]:
        payload = data.dict()
        # Validaciones mínimas (DB FK hará el resto)
        if payload["user_id"] <= 0:
            raise ValidationError("user_id inválido")
        return payload

    def _validate_update_data(self, id: int, data: DeviceUpdateSchema) -> Dict[str, Any]:
        payload = {k: v for k, v in data.dict().items() if v is not None}
        if "user_id" in payload and payload["user_id"] <= 0:
            raise ValidationError("user_id inválido")
        return payload

    def _to_response_schema(self, entity: Device) -> DeviceSchema:
        return DeviceSchema.from_orm(entity)

    def get_by_user(self, user_id: int) -> List[DeviceSchema]:
        try:
            items = self.repository.get_by_user(user_id)
            return [self._to_response_schema(it) for it in items]
        except Exception as e:
            logger.error(f"Error al obtener dispositivos por usuario {user_id}: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")

# Servicio del módulo Maintenance Log
import logging
from typing import Dict, Any, List
from fastapi import HTTPException, status

from app.shared.base_service import BaseService
from app.modules.maintenance_log.models import (
    MaintenanceLog,
    MaintenanceLogCreateSchema,
    MaintenanceLogUpdateSchema,
    MaintenanceLogSchema,
)
from app.modules.maintenance_log.repository import MaintenanceLogRepository

logger = logging.getLogger(__name__)


class MaintenanceLogService(BaseService[MaintenanceLog, MaintenanceLogCreateSchema, MaintenanceLogUpdateSchema, MaintenanceLogSchema]):
    def __init__(self):
        self.repository = MaintenanceLogRepository()
        super().__init__(self.repository)

    def _validate_create_data(self, data: MaintenanceLogCreateSchema) -> Dict[str, Any]:
        return data.dict()

    def _validate_update_data(self, id: int, data: MaintenanceLogUpdateSchema) -> Dict[str, Any]:
        return {k: v for k, v in data.dict().items() if v is not None}

    def _to_response_schema(self, entity: MaintenanceLog) -> MaintenanceLogSchema:
        return MaintenanceLogSchema.from_orm(entity)

    def get_by_device(self, device_id: int) -> List[MaintenanceLogSchema]:
        try:
            items = self.repository.get_by_device(device_id)
            return [self._to_response_schema(it) for it in items]
        except Exception as e:
            logger.error(f"Error al obtener mantenimientos por dispositivo {device_id}: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")

# Servicio del módulo Connection
import logging
from typing import Dict, Any, List
from fastapi import HTTPException, status

from app.shared.base_service import BaseService
from app.modules.connection.models import Connection, ConnectionCreateSchema, ConnectionUpdateSchema, ConnectionSchema
from app.modules.connection.repository import ConnectionRepository

logger = logging.getLogger(__name__)


class ConnectionService(BaseService[Connection, ConnectionCreateSchema, ConnectionUpdateSchema, ConnectionSchema]):
    def __init__(self):
        self.repository = ConnectionRepository()
        super().__init__(self.repository)

    def _validate_create_data(self, data: ConnectionCreateSchema) -> Dict[str, Any]:
        return data.dict()

    def _validate_update_data(self, id: int, data: ConnectionUpdateSchema) -> Dict[str, Any]:
        return {k: v for k, v in data.dict().items() if v is not None}

    def _to_response_schema(self, entity: Connection) -> ConnectionSchema:
        return ConnectionSchema.from_orm(entity)

    def get_by_device(self, device_id: int) -> List[ConnectionSchema]:
        try:
            items = self.repository.get_by_device(device_id)
            return [self._to_response_schema(it) for it in items]
        except Exception as e:
            logger.error(f"Error al obtener conexiones por dispositivo {device_id}: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")

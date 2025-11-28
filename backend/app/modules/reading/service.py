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
        """
        Valida los datos para crear una lectura de sensores.
        Ahora valida user_id y device_id, y los rangos de los valores de sensores.
        """
        payload = data.dict(exclude_none=True)
        
        # Validar user_id y device_id
        if payload.get("user_id", 0) <= 0:
            raise ValidationError("user_id inválido o faltante")
        if payload.get("device_id", 0) <= 0:
            raise ValidationError("device_id inválido o faltante")
        
        # Validar rangos de valores de sensores
        if "mq7" in payload and payload["mq7"] is not None:
            if payload["mq7"] < 0 or payload["mq7"] > 10000:
                raise ValidationError("mq7 fuera de rango (0-10000 ppm)")
        
        if "pulse" in payload and payload["pulse"] is not None:
            if payload["pulse"] < 0 or payload["pulse"] > 300:
                raise ValidationError("pulse fuera de rango (0-300 bpm)")
        
        # Validar acelerómetro (rango típico: -20 a +20 m/s²)
        for axis in ["ax", "ay", "az"]:
            if axis in payload and payload[axis] is not None:
                if payload[axis] < -20 or payload[axis] > 20:
                    raise ValidationError(f"{axis} fuera de rango (-20 a +20 m/s²)")
        
        # Validar giroscopio (rango típico: -10 a +10 rad/s)
        for axis in ["gx", "gy", "gz"]:
            if axis in payload and payload[axis] is not None:
                if payload[axis] < -10 or payload[axis] > 10:
                    raise ValidationError(f"{axis} fuera de rango (-10 a +10 rad/s)")
        
        return payload

    def _validate_update_data(self, id: int, data: ReadingUpdateSchema) -> Dict[str, Any]:
        """
        Valida los datos para actualizar una lectura.
        """
        payload = {k: v for k, v in data.dict().items() if v is not None}
        
        if "user_id" in payload and payload["user_id"] <= 0:
            raise ValidationError("user_id inválido")
        if "device_id" in payload and payload["device_id"] <= 0:
            raise ValidationError("device_id inválido")
        
        # Validar rangos si se actualizan
        if "mq7" in payload and (payload["mq7"] < 0 or payload["mq7"] > 10000):
            raise ValidationError("mq7 fuera de rango")
        if "pulse" in payload and (payload["pulse"] < 0 or payload["pulse"] > 300):
            raise ValidationError("pulse fuera de rango")
        
        return payload

    def _to_response_schema(self, entity: Reading) -> ReadingSchema:
        return ReadingSchema.from_orm(entity)

    def get_by_device(self, device_id: int, start: Optional[datetime] = None, end: Optional[datetime] = None) -> List[ReadingSchema]:
        """
        Obtiene todas las lecturas de un dispositivo específico.
        Devuelve todas las lecturas de sensores (mq7, pulse, acelerómetro, giroscopio).
        """
        try:
            items = self.repository.get_by_device(device_id, start, end)
            return [self._to_response_schema(it) for it in items]
        except Exception as e:
            logger.error(f"Error al obtener lecturas por dispositivo {device_id}: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")

    def get_by_user(self, user_id: int, limit: int = 100) -> List[ReadingSchema]:
        """
        Obtiene las últimas lecturas de un usuario.
        Devuelve todas las lecturas con todos los sensores.
        """
        try:
            items = self.repository.get_by_user(user_id, limit)
            return [self._to_response_schema(it) for it in items]
        except Exception as e:
            logger.error(f"Error al obtener lecturas por usuario {user_id}: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")
    
    def get_latest_by_device(self, device_id: int) -> Optional[ReadingSchema]:
        """
        Obtiene la última lectura de un dispositivo.
        """
        try:
            item = self.repository.get_latest_by_device(device_id)
            return self._to_response_schema(item) if item else None
        except Exception as e:
            logger.error(f"Error al obtener última lectura del dispositivo {device_id}: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")

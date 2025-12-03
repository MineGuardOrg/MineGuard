# Servicio del módulo Reading
import logging
import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime
from fastapi import HTTPException, status

from app.shared.base_service import BaseService
from app.shared.exceptions import ValidationError
from app.modules.reading.models import Reading, ReadingCreateSchema, ReadingUpdateSchema, ReadingSchema
from app.modules.reading.repository import ReadingRepository
from app.core.websocket import manager

logger = logging.getLogger(__name__)


class ReadingService(BaseService[Reading, ReadingCreateSchema, ReadingUpdateSchema, ReadingSchema]):
    def __init__(self):
        self.repository = ReadingRepository()
        super().__init__(self.repository)
    
    async def create(self, data: ReadingCreateSchema) -> ReadingSchema:
        """
        Crea una nueva lectura y verifica alertas en tiempo real.
        Sobrescribe el método base para hacerlo async y agregar verificación de alertas.
        """
        try:
            # Validar y preparar datos
            validated_data = self._validate_create_data(data)
            
            # Crear entidad
            entity = self.repository.create(validated_data)
            
            logger.info(f"{self.model_name} creado exitosamente - ID: {entity.id}")
            
            # Verificar y enviar alertas en tiempo real (async)
            await self._check_and_broadcast_alerts(entity)
            
            return self._to_response_schema(entity)
            
        except HTTPException:
            raise
        except (ValidationError,) as e:
            logger.error(f"Error al crear {self.model_name}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        except Exception as e:
            logger.error(f"Error al crear {self.model_name}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error interno del servidor al crear {self.model_name}"
            )
    
    async def _check_and_broadcast_alerts(self, reading: Reading):
        """
        Verifica si una lectura tiene valores críticos y envía alertas por WebSocket.
        Umbrales:
        - Temperatura: >38.4°C (warning), >39.2°C (critical)
        - Ritmo cardíaco alto: >130 bpm (warning), >140 bpm (critical)
        - Ritmo cardíaco bajo: <50 bpm (warning), <45 bpm (critical)
        - CO (mq7): >50 ppm (warning), >100 ppm (critical)
        """
        from app.core.database import SessionLocal
        from app.modules.auth.models import User
        from app.modules.area.models import Area
        from app.modules.alert.models import Alert
        
        alerts_to_send = []
        
        # Verificar temperatura corporal
        if reading.body_temp is not None:
            if reading.body_temp > 39.2:
                alerts_to_send.append({
                    "type": "high_body_temperature",
                    "severity": "critical",
                    "value": float(reading.body_temp),
                    "message": f"Temperatura corporal crítica: {reading.body_temp:.1f}°C"
                })
            elif reading.body_temp > 38.4:
                alerts_to_send.append({
                    "type": "high_body_temperature",
                    "severity": "warning",
                    "value": float(reading.body_temp),
                    "message": f"Temperatura corporal elevada: {reading.body_temp:.1f}°C"
                })
        
        # Verificar ritmo cardíaco
        if reading.pulse is not None:
            if reading.pulse > 140:
                alerts_to_send.append({
                    "type": "heart_rate_high",
                    "severity": "critical",
                    "value": float(reading.pulse),
                    "message": f"Ritmo cardíaco muy alto: {reading.pulse:.0f} bpm"
                })
            elif reading.pulse > 130:
                alerts_to_send.append({
                    "type": "heart_rate_high",
                    "severity": "warning",
                    "value": float(reading.pulse),
                    "message": f"Ritmo cardíaco alto: {reading.pulse:.0f} bpm"
                })
            elif reading.pulse < 45:
                alerts_to_send.append({
                    "type": "heart_rate_low",
                    "severity": "critical",
                    "value": float(reading.pulse),
                    "message": f"Ritmo cardíaco muy bajo: {reading.pulse:.0f} bpm"
                })
            elif reading.pulse < 50:
                alerts_to_send.append({
                    "type": "heart_rate_low",
                    "severity": "warning",
                    "value": float(reading.pulse),
                    "message": f"Ritmo cardíaco bajo: {reading.pulse:.0f} bpm"
                })
        
        # Verificar CO (gases tóxicos)
        if reading.mq7 is not None:
            if reading.mq7 > 100:
                alerts_to_send.append({
                    "type": "toxic_gas",
                    "severity": "critical",
                    "value": float(reading.mq7),
                    "message": f"Nivel de CO crítico: {reading.mq7:.0f} ppm"
                })
            elif reading.mq7 > 50:
                alerts_to_send.append({
                    "type": "toxic_gas",
                    "severity": "warning",
                    "value": float(reading.mq7),
                    "message": f"Nivel de CO elevado: {reading.mq7:.0f} ppm"
                })
        
        # Si hay alertas, obtener información del usuario y broadcast
        if alerts_to_send and len(manager.active_connections) > 0:
            db = SessionLocal()
            try:
                user = db.query(User).filter(User.id == reading.user_id).first()
                if user:
                    area = db.query(Area).filter(Area.id == user.area_id).first() if user.area_id else None
                    
                    for alert_data in alerts_to_send:
                        # Crear la alerta en la base de datos
                        alert = Alert(
                            alert_type=alert_data["type"],
                            severity="high" if alert_data["severity"] == "critical" else "medium",
                            message=alert_data["message"],
                            reading_id=reading.id,
                            user_id=reading.user_id
                        )
                        db.add(alert)
                        db.commit()
                        db.refresh(alert)
                        
                        # Preparar datos para WebSocket
                        ws_alert_data = {
                            "id": alert.id,
                            "type": alert_data["type"],
                            "severity": alert_data["severity"],
                            "worker_name": f"{user.first_name} {user.last_name}",
                            "area": area.name if area else None,
                            "value": alert_data["value"],
                            "timestamp": alert.timestamp.isoformat()
                        }
                        
                        # Broadcast a todos los clientes WebSocket
                        await manager.broadcast_alert(ws_alert_data)
                        logger.info(f"Alerta enviada por WebSocket: {alert_data['type']} - {user.first_name} {user.last_name}")
            except Exception as e:
                logger.error(f"Error al enviar alerta por WebSocket: {str(e)}")
            finally:
                db.close()

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

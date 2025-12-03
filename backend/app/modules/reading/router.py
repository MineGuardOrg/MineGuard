# Router del módulo Reading
from fastapi import APIRouter, Depends, status, Query
from typing import List, Optional
from datetime import datetime
from app.modules.reading.models import ReadingCreateSchema, ReadingUpdateSchema, ReadingSchema
from app.modules.reading.service import ReadingService
from app.core.security import get_current_user

reading_router = APIRouter()
service = ReadingService()


@reading_router.get("/", response_model=List[ReadingSchema])
def get_all(current_user=Depends(get_current_user)):
    return service.get_all()


@reading_router.get("/{reading_id}", response_model=ReadingSchema)
def get_by_id(reading_id: int, current_user=Depends(get_current_user)):
    return service.get_by_id(reading_id)


@reading_router.get("/by-device/{device_id}", response_model=List[ReadingSchema])
def by_device(
    device_id: int,
    start: Optional[datetime] = Query(None),
    end: Optional[datetime] = Query(None),
    current_user=Depends(get_current_user),
):
    """
    Obtiene todas las lecturas de un dispositivo específico.
    Incluye todos los valores de sensores (mq7, pulse, acelerómetro, giroscopio).
    """
    return service.get_by_device(device_id, start, end)


@reading_router.get("/by-device/{device_id}/latest", response_model=ReadingSchema)
def latest_by_device(device_id: int, current_user=Depends(get_current_user)):
    """
    Obtiene la última lectura de un dispositivo.
    """
    return service.get_latest_by_device(device_id)


@reading_router.get("/by-user/{user_id}", response_model=List[ReadingSchema])
def by_user(user_id: int, limit: int = 100, current_user=Depends(get_current_user)):
    """
    Obtiene las últimas lecturas de un usuario.
    Devuelve todas las lecturas con todos los sensores.
    """
    return service.get_by_user(user_id, limit)


@reading_router.post("/", response_model=ReadingSchema, status_code=status.HTTP_201_CREATED)
async def create(payload: ReadingCreateSchema, current_user=Depends(get_current_user)):
    """
    Crea una nueva lectura con todos los valores de sensores.
    Acepta: user_id, device_id, mq7, pulse, ax, ay, az, gx, gy, gz
    
    Ejemplo de payload del hardware:
    {
        "user_id": 1,
        "device_id": 1,
        "mq7": 403,
        "pulse": 2914,
        "ax": 10.20169,
        "ay": -0.198719,
        "az": -3.337517,
        "gx": -0.001466,
        "gy": 0.020917,
        "gz": -0.028911
    }
    """
    return await service.create(payload)

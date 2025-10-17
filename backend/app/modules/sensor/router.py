# Router del módulo Sensor
from fastapi import APIRouter, Depends, status
from typing import List
from app.modules.sensor.models import SensorCreateSchema, SensorUpdateSchema, SensorSchema
from app.modules.sensor.service import SensorService
from app.core.security import get_current_user

sensor_router = APIRouter()
service = SensorService()


@sensor_router.get("/", response_model=List[SensorSchema])
def get_all(current_user=Depends(get_current_user)):
    return service.get_all()


@sensor_router.get("/{sensor_id}", response_model=SensorSchema)
def get_by_id(sensor_id: int, current_user=Depends(get_current_user)):
    return service.get_by_id(sensor_id)


@sensor_router.get("/by-device/{device_id}", response_model=List[SensorSchema])
def get_by_device(device_id: int, current_user=Depends(get_current_user)):
    return service.get_by_device(device_id)


@sensor_router.post("/", response_model=SensorSchema, status_code=status.HTTP_201_CREATED)
def create(payload: SensorCreateSchema, current_user=Depends(get_current_user)):
    return service.create(payload)


@sensor_router.put("/{sensor_id}", response_model=SensorSchema)
def update(sensor_id: int, payload: SensorUpdateSchema, current_user=Depends(get_current_user)):
    return service.update(sensor_id, payload)


@sensor_router.delete("/{sensor_id}")
def delete(sensor_id: int, current_user=Depends(get_current_user)):
    return service.delete(sensor_id)

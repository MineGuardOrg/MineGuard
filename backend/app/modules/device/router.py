# Router del módulo Device
from fastapi import APIRouter, Depends, status
from typing import List
from app.modules.device.models import DeviceCreateSchema, DeviceUpdateSchema, DeviceSchema
from app.modules.device.service import DeviceService
from app.core.security import get_current_user

device_router = APIRouter()
service = DeviceService()


@device_router.get("/", response_model=List[DeviceSchema])
def get_all(current_user=Depends(get_current_user)):
    return service.get_all()


@device_router.get("/{device_id}", response_model=DeviceSchema)
def get_by_id(device_id: int, current_user=Depends(get_current_user)):
    return service.get_by_id(device_id)


@device_router.get("/by-user/{user_id}", response_model=List[DeviceSchema])
def get_by_user(user_id: int, current_user=Depends(get_current_user)):
    return service.get_by_user(user_id)


@device_router.post("/", response_model=DeviceSchema, status_code=status.HTTP_201_CREATED)
def create(payload: DeviceCreateSchema, current_user=Depends(get_current_user)):
    return service.create(payload)


@device_router.put("/{device_id}", response_model=DeviceSchema)
def update(device_id: int, payload: DeviceUpdateSchema, current_user=Depends(get_current_user)):
    return service.update(device_id, payload)


@device_router.delete("/{device_id}")
def delete(device_id: int, current_user=Depends(get_current_user)):
    return service.delete(device_id)

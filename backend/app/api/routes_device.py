# Endpoints de dispositivos
from fastapi import APIRouter, HTTPException
from app.application.device_service import DeviceService
from app.domain.schemas.device_schema import DeviceSchema

device_router = APIRouter()

@device_router.get("/", response_model=list[DeviceSchema])
def get_all_devices():
    return DeviceService.get_all_devices()

@device_router.get("/{device_id}", response_model=DeviceSchema)
def get_device(device_id: int):
    device = DeviceService.get_device_by_id(device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    return device

@device_router.post("/", response_model=DeviceSchema)
def create_device(device: DeviceSchema):
    device_dict = device.dict(exclude_unset=True)
    new_device = DeviceService.create_device(device_dict)
    return new_device

@device_router.delete("/{device_id}")
def delete_device(device_id: int):
    result = DeviceService.soft_delete_device(device_id)
    if not result:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado o ya eliminado")
    return {"message": "Dispositivo eliminado (soft delete)"}

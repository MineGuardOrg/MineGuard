# Router del módulo Maintenance Log
from fastapi import APIRouter, Depends, status
from typing import List
from app.modules.maintenance_log.models import (
    MaintenanceLogCreateSchema,
    MaintenanceLogUpdateSchema,
    MaintenanceLogSchema,
)
from app.modules.maintenance_log.service import MaintenanceLogService
from app.core.security import get_current_user

maintenance_log_router = APIRouter()
service = MaintenanceLogService()


@maintenance_log_router.get("/", response_model=List[MaintenanceLogSchema])
def get_all(current_user=Depends(get_current_user)):
    return service.get_all()


@maintenance_log_router.get("/{log_id}", response_model=MaintenanceLogSchema)
def get_by_id(log_id: int, current_user=Depends(get_current_user)):
    return service.get_by_id(log_id)


@maintenance_log_router.get("/by-device/{device_id}", response_model=List[MaintenanceLogSchema])
def by_device(device_id: int, current_user=Depends(get_current_user)):
    return service.get_by_device(device_id)


@maintenance_log_router.post("/", response_model=MaintenanceLogSchema, status_code=status.HTTP_201_CREATED)
def create(payload: MaintenanceLogCreateSchema, current_user=Depends(get_current_user)):
    return service.create(payload)


@maintenance_log_router.put("/{log_id}", response_model=MaintenanceLogSchema)
def update(log_id: int, payload: MaintenanceLogUpdateSchema, current_user=Depends(get_current_user)):
    return service.update(log_id, payload)


@maintenance_log_router.delete("/{log_id}")
def delete(log_id: int, current_user=Depends(get_current_user)):
    return service.delete(log_id)

# Router del módulo Connection
from fastapi import APIRouter, Depends, status
from typing import List
from app.modules.connection.models import ConnectionCreateSchema, ConnectionUpdateSchema, ConnectionSchema
from app.modules.connection.service import ConnectionService
from app.core.security import get_current_user

connection_router = APIRouter()
service = ConnectionService()


@connection_router.get("/", response_model=List[ConnectionSchema])
def get_all(current_user=Depends(get_current_user)):
    return service.get_all()


@connection_router.get("/{id}", response_model=ConnectionSchema)
def get_by_id(id: int, current_user=Depends(get_current_user)):
    return service.get_by_id(id)


@connection_router.get("/by-device/{device_id}", response_model=List[ConnectionSchema])
def by_device(device_id: int, current_user=Depends(get_current_user)):
    return service.get_by_device(device_id)


@connection_router.post("/", response_model=ConnectionSchema, status_code=status.HTTP_201_CREATED)
def create(payload: ConnectionCreateSchema, current_user=Depends(get_current_user)):
    return service.create(payload)


@connection_router.put("/{id}", response_model=ConnectionSchema)
def update(id: int, payload: ConnectionUpdateSchema, current_user=Depends(get_current_user)):
    return service.update(id, payload)


@connection_router.delete("/{id}")
def delete(id: int, current_user=Depends(get_current_user)):
    return service.delete(id)

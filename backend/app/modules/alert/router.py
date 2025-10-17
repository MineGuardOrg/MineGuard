# Router del módulo Alert
from fastapi import APIRouter, Depends, status
from typing import List
from app.modules.alert.models import AlertCreateSchema, AlertUpdateSchema, AlertSchema
from app.modules.alert.service import AlertService
from app.core.security import get_current_user

alert_router = APIRouter()
service = AlertService()


@alert_router.get("/", response_model=List[AlertSchema])
def get_all(current_user=Depends(get_current_user)):
    return service.get_all()


@alert_router.get("/{alert_id}", response_model=AlertSchema)
def get_by_id(alert_id: int, current_user=Depends(get_current_user)):
    return service.get_by_id(alert_id)


@alert_router.get("/by-reading/{reading_id}", response_model=List[AlertSchema])
def by_reading(reading_id: int, current_user=Depends(get_current_user)):
    return service.get_by_reading(reading_id)


@alert_router.post("/", response_model=AlertSchema, status_code=status.HTTP_201_CREATED)
def create(payload: AlertCreateSchema, current_user=Depends(get_current_user)):
    return service.create(payload)


@alert_router.put("/{alert_id}", response_model=AlertSchema)
def update(alert_id: int, payload: AlertUpdateSchema, current_user=Depends(get_current_user)):
    return service.update(alert_id, payload)


@alert_router.delete("/{alert_id}")
def delete(alert_id: int, current_user=Depends(get_current_user)):
    return service.delete(alert_id)

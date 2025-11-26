# Router del módulo Alert
# Las alertas son datos históricos inmutables (solo lectura)
from fastapi import APIRouter, Depends
from typing import List
from app.modules.alert.models import AlertSchema
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

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


@reading_router.get("/by-sensor/{sensor_id}", response_model=List[ReadingSchema])
def by_sensor(
    sensor_id: int,
    start: Optional[datetime] = Query(None),
    end: Optional[datetime] = Query(None),
    current_user=Depends(get_current_user),
):
    return service.get_by_sensor(sensor_id, start, end)


@reading_router.get("/by-user/{user_id}", response_model=List[ReadingSchema])
def by_user(user_id: int, limit: int = 100, current_user=Depends(get_current_user)):
    return service.get_by_user(user_id, limit)


@reading_router.post("/", response_model=ReadingSchema, status_code=status.HTTP_201_CREATED)
def create(payload: ReadingCreateSchema, current_user=Depends(get_current_user)):
    return service.create(payload)

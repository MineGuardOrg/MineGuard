# Router del módulo ML Training Data
from fastapi import APIRouter, Depends, status
from typing import List
from app.modules.ml_training_data.models import (
    MLTrainingDataCreateSchema,
    MLTrainingDataUpdateSchema,
    MLTrainingDataSchema,
)
from app.modules.ml_training_data.service import MLTrainingDataService
from app.core.security import get_current_user

ml_training_data_router = APIRouter()
service = MLTrainingDataService()


@ml_training_data_router.get("/", response_model=List[MLTrainingDataSchema])
def get_all(current_user=Depends(get_current_user)):
    return service.get_all()


@ml_training_data_router.get("/{id}", response_model=MLTrainingDataSchema)
def get_by_id(id: int, current_user=Depends(get_current_user)):
    return service.get_by_id(id)


@ml_training_data_router.get("/by-reading/{reading_id}", response_model=List[MLTrainingDataSchema])
def by_reading(reading_id: int, current_user=Depends(get_current_user)):
    return service.get_by_reading(reading_id)


@ml_training_data_router.post("/", response_model=MLTrainingDataSchema, status_code=status.HTTP_201_CREATED)
def create(payload: MLTrainingDataCreateSchema, current_user=Depends(get_current_user)):
    return service.create(payload)


@ml_training_data_router.put("/{id}", response_model=MLTrainingDataSchema)
def update(id: int, payload: MLTrainingDataUpdateSchema, current_user=Depends(get_current_user)):
    return service.update(id, payload)


@ml_training_data_router.delete("/{id}")
def delete(id: int, current_user=Depends(get_current_user)):
    return service.delete(id)

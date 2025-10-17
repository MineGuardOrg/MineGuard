# Router del módulo ML Prediction
from fastapi import APIRouter, Depends, status
from typing import List
from app.modules.ml_prediction.models import (
    MLPredictionCreateSchema,
    MLPredictionUpdateSchema,
    MLPredictionSchema,
)
from app.modules.ml_prediction.service import MLPredictionService
from app.core.security import get_current_user

ml_prediction_router = APIRouter()
service = MLPredictionService()


@ml_prediction_router.get("/", response_model=List[MLPredictionSchema])
def get_all(current_user=Depends(get_current_user)):
    return service.get_all()


@ml_prediction_router.get("/{id}", response_model=MLPredictionSchema)
def get_by_id(id: int, current_user=Depends(get_current_user)):
    return service.get_by_id(id)


@ml_prediction_router.get("/by-reading/{reading_id}", response_model=List[MLPredictionSchema])
def by_reading(reading_id: int, current_user=Depends(get_current_user)):
    return service.get_by_reading(reading_id)


@ml_prediction_router.post("/", response_model=MLPredictionSchema, status_code=status.HTTP_201_CREATED)
def create(payload: MLPredictionCreateSchema, current_user=Depends(get_current_user)):
    return service.create(payload)


@ml_prediction_router.put("/{id}", response_model=MLPredictionSchema)
def update(id: int, payload: MLPredictionUpdateSchema, current_user=Depends(get_current_user)):
    return service.update(id, payload)


@ml_prediction_router.delete("/{id}")
def delete(id: int, current_user=Depends(get_current_user)):
    return service.delete(id)

from fastapi import APIRouter, HTTPException
from app.application.ml_prediction_service import MLPredictionService
from app.domain.schemas.ml_prediction_schema import MLPredictionSchema

ml_prediction_router = APIRouter()

@ml_prediction_router.get("/", response_model=list[MLPredictionSchema])
def get_all_ml_predictions():
    return MLPredictionService.get_all_ml_predictions()

@ml_prediction_router.get("/{prediction_id}", response_model=MLPredictionSchema)
def get_ml_prediction(prediction_id: int):
    prediction = MLPredictionService.get_ml_prediction_by_id(prediction_id)
    if not prediction:
        raise HTTPException(status_code=404, detail="Predicción no encontrada")
    return prediction

@ml_prediction_router.post("/", response_model=MLPredictionSchema)
def create_ml_prediction(prediction: MLPredictionSchema):
    prediction_dict = prediction.dict(exclude_unset=True)
    new_prediction = MLPredictionService.create_ml_prediction(prediction_dict)
    return new_prediction

@ml_prediction_router.delete("/{prediction_id}")
def delete_ml_prediction(prediction_id: int):
    result = MLPredictionService.soft_delete_ml_prediction(prediction_id)
    if not result:
        raise HTTPException(status_code=404, detail="Predicción no encontrada o ya eliminada")
    return {"message": "Predicción eliminada (soft delete)"}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.ml.train import train_models
from app.ml.predict import predict_student
from app.schemas.student import PredictionRequest, PredictionResponse

router = APIRouter()

@router.post("/train")
async def train_ml_models(db: Session = Depends(get_db)):
    """
    Entrenar modelos de Machine Learning
    - Clasificación: predice si el estudiante reprobará
    - Regresión: predice la calificación estimada
    """
    try:
        result = train_models(db)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error entrenando modelos: {str(e)}"
        )

@router.post("/predict", response_model=PredictionResponse)
async def predict(
    request: PredictionRequest,
    db: Session = Depends(get_db)
):
    """
    Realizar predicción para un estudiante
    Retorna probabilidad de reprobación y calificación estimada
    """
    try:
        result = predict_student(request.student_id, db)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error realizando predicción: {str(e)}"
        )

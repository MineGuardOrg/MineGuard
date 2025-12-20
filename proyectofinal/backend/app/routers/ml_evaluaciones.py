from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.ml.train_evaluacion import train_models_evaluacion
from app.ml.predict_evaluacion import predict_evaluacion, predict_por_matricula
from app.schemas.evaluacion import PrediccionEvaluacionRequest

router = APIRouter()

@router.post("/train-evaluacion")
async def train_ml_models_evaluacion(db: Session = Depends(get_db)):
    """
    Entrenar modelos de Machine Learning con el dataset académico completo
    - RandomForest + LogisticRegression para clasificación (predicción de reprobación)
    - DecisionTreeRegressor para regresión (estimación de calificación)
    Usa variables: turno, modalidad, campus, programa, docente, etc.
    """
    try:
        result = train_models_evaluacion(db)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error entrenando modelos: {str(e)}"
        )

@router.post("/predict-evaluacion")
async def predict_eval(
    request: PrediccionEvaluacionRequest,
    db: Session = Depends(get_db)
):
    """
    Realizar predicción para una evaluación o estudiante
    - Por evaluacion_id: predice una evaluación específica
    - Por matricula: predice todas las evaluaciones del estudiante
    Retorna probabilidad de reprobación, calificación estimada y nivel de riesgo
    """
    try:
        if request.evaluacion_id:
            result = predict_evaluacion(request.evaluacion_id, db)
        elif request.matricula:
            result = predict_por_matricula(request.matricula, db)
        else:
            raise HTTPException(
                status_code=400,
                detail="Debe proporcionar evaluacion_id o matricula"
            )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error realizando predicción: {str(e)}"
        )

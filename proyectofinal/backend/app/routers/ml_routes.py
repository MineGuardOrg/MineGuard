from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.ml.predict import predict_student
from app.schemas.student import PredictionRequest, PredictionResponse
import subprocess
import os

router = APIRouter()

@router.post("/train")
async def train_ml_models(db: Session = Depends(get_db)):
    """
    Entrenar modelos de Machine Learning ejecutando el notebook train.ipynb
    - Clasificación: predice si el estudiante reprobará
    - Regresión: predice la calificación estimada
    """
    try:
        # Ruta al notebook
        notebook_path = os.path.join(os.path.dirname(__file__), "..", "ml", "train.ipynb")
        
        # Ejecutar notebook usando nbconvert
        result = subprocess.run(
            ["jupyter", "nbconvert", "--to", "notebook", "--execute", 
             "--inplace", notebook_path],
            capture_output=True,
            text=True,
            cwd=os.path.dirname(notebook_path)
        )
        
        if result.returncode != 0:
            raise Exception(f"Error ejecutando notebook: {result.stderr}")
        
        return {
            "message": "Modelos de students entrenados exitosamente",
            "notebook": "train.ipynb",
            "models_created": [
                "model_clasificacion_students.joblib",
                "model_regresion_students.joblib"
            ]
        }
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

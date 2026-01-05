from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.ml.predict_evaluacion import predict_evaluacion, predict_por_matricula
from app.schemas.evaluacion import PrediccionEvaluacionRequest
import subprocess
import os

router = APIRouter()

@router.post("/train-evaluacion")
async def train_ml_models_evaluacion(db: Session = Depends(get_db)):
    """
    Entrenar TODOS los modelos de Machine Learning ejecutando ambos notebooks:
    - train_evaluacion.ipynb: Modelos para evaluaciones (RF, LR, Regresión)
    - train.ipynb: Modelos para students (RF, Regresión)
    """
    try:
        modelos_creados = []
        notebooks_ejecutados = []
        
        # 1. Entrenar modelos de evaluaciones
        notebook_eval_path = os.path.join(os.path.dirname(__file__), "..", "ml", "train_evaluacion.ipynb")
        
        result_eval = subprocess.run(
            ["jupyter", "nbconvert", "--to", "notebook", "--execute", 
             "--inplace", notebook_eval_path],
            capture_output=True,
            text=True,
            cwd=os.path.dirname(notebook_eval_path)
        )
        
        if result_eval.returncode != 0:
            raise Exception(f"Error ejecutando train_evaluacion.ipynb: {result_eval.stderr}")
        
        notebooks_ejecutados.append("train_evaluacion.ipynb")
        modelos_creados.extend([
            "model_clasificacion_rf.joblib",
            "model_clasificacion_lr.joblib",
            "model_regresion.joblib",
            "label_encoders.joblib"
        ])
        
        # 2. Entrenar modelos de students
        notebook_students_path = os.path.join(os.path.dirname(__file__), "..", "ml", "train.ipynb")
        
        result_students = subprocess.run(
            ["jupyter", "nbconvert", "--to", "notebook", "--execute", 
             "--inplace", notebook_students_path],
            capture_output=True,
            text=True,
            cwd=os.path.dirname(notebook_students_path)
        )
        
        if result_students.returncode != 0:
            raise Exception(f"Error ejecutando train.ipynb: {result_students.stderr}")
        
        notebooks_ejecutados.append("train.ipynb")
        modelos_creados.extend([
            "model_clasificacion_students.joblib",
            "model_regresion_students.joblib"
        ])
        
        return {
            "message": "Todos los modelos entrenados exitosamente",
            "notebooks_ejecutados": notebooks_ejecutados,
            "total_modelos": len(modelos_creados),
            "models_created": modelos_creados
        }
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

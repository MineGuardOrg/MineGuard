import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
import joblib
import os
from fastapi import HTTPException
from app.models.student import Student

def predict_student(student_id: int, db: Session):
    """
    Realizar predicción para un estudiante específico
    Retorna probabilidad de reprobación y calificación estimada
    """
    
    # Verificar que los modelos existan
    clf_path = 'models/model_clasificacion_students.joblib'
    reg_path = 'models/model_regresion_students.joblib'
    
    if not os.path.exists(clf_path) or not os.path.exists(reg_path):
        raise HTTPException(
            status_code=400,
            detail="Los modelos no han sido entrenados. Ejecute /train primero"
        )
    
    # Cargar modelos
    clf_model = joblib.load(clf_path)
    reg_model = joblib.load(reg_path)
    
    # Obtener estudiante
    student = db.query(Student).filter(Student.id == student_id).first()
    
    if not student:
        raise HTTPException(
            status_code=404,
            detail=f"Estudiante con ID {student_id} no encontrado"
        )
    
    # Preparar features
    features = pd.DataFrame([{
        'edad': student.edad,
        'promedio_anterior': student.promedio_anterior,
        'asistencia': student.asistencia,
        'horas_estudio': student.horas_estudio,
        'participacion': student.participacion
    }])
    
    # Verificar valores nulos
    if features.isnull().any().any():
        raise HTTPException(
            status_code=400,
            detail="El estudiante tiene datos incompletos para realizar la predicción"
        )
    
    # Realizar predicciones
    # Clasificación: probabilidad de reprobar
    prob_reprobar = clf_model.predict_proba(features)[0][1]
    
    # Regresión: calificación estimada
    calificacion_estimada = reg_model.predict(features)[0]
    
    # Actualizar estudiante con predicciones
    student.prediccion_reprobacion = float(prob_reprobar)
    student.calificacion_estimada = float(calificacion_estimada)
    db.commit()
    
    # Determinar estado
    estado = "En riesgo" if prob_reprobar > 0.5 else "Sin riesgo"
    
    return {
        "student_id": student.id,
        "nombre": student.nombre,
        "prediccion_reprobacion": round(prob_reprobar, 4),
        "calificacion_estimada": round(calificacion_estimada, 2),
        "estado": estado
    }

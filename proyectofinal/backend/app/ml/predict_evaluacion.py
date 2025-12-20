import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
import joblib
import os
from fastapi import HTTPException
from app.models.evaluacion import Evaluacion

def predict_evaluacion(evaluacion_id: int, db: Session):
    """
    Realizar predicción para una evaluación específica
    Retorna probabilidad de reprobación, calificación estimada y nivel de riesgo
    """
    
    # Verificar que los modelos existan
    rf_path = 'models/model_clasificacion_rf.joblib'
    reg_path = 'models/model_regresion.joblib'
    encoders_path = 'models/label_encoders.joblib'
    
    if not all(os.path.exists(p) for p in [rf_path, reg_path, encoders_path]):
        raise HTTPException(
            status_code=400,
            detail="Los modelos no han sido entrenados. Ejecute /train-evaluacion primero"
        )
    
    # Cargar modelos
    rf_model = joblib.load(rf_path)
    reg_model = joblib.load(reg_path)
    label_encoders = joblib.load(encoders_path)
    
    # Obtener evaluación
    evaluacion = db.query(Evaluacion).filter(Evaluacion.id == evaluacion_id).first()
    
    if not evaluacion:
        raise HTTPException(
            status_code=404,
            detail=f"Evaluación con ID {evaluacion_id} no encontrada"
        )
    
    # Preparar features
    features_data = {
        'numero_periodo': evaluacion.numero_periodo or 0,
        'creditos': evaluacion.creditos or 0,
    }
    
    # Codificar variables categóricas
    categorical_features = {
        'turno': evaluacion.turno,
        'modalidad': evaluacion.modalidad,
        'campus': evaluacion.campus,
        'programa': evaluacion.programa,
        'etapa_formativa': evaluacion.etapa_formativa,
        'tipo_asignatura': evaluacion.tipo_asignatura,
        'estado_alumno': evaluacion.estado_alumno
    }
    
    for col, value in categorical_features.items():
        if col in label_encoders:
            try:
                # Si el valor es None o no está en las clases conocidas
                if value is None:
                    value = 'Desconocido'
                
                if value not in label_encoders[col].classes_:
                    # Usar la clase 'Desconocido' o la primera clase disponible
                    value = 'Desconocido' if 'Desconocido' in label_encoders[col].classes_ else label_encoders[col].classes_[0]
                
                features_data[col + '_encoded'] = label_encoders[col].transform([value])[0]
            except Exception as e:
                # En caso de error, usar 0 como valor por defecto
                features_data[col + '_encoded'] = 0
    
    # Crear DataFrame con las features
    feature_columns = [
        'numero_periodo', 'creditos',
        'turno_encoded', 'modalidad_encoded', 'campus_encoded',
        'programa_encoded', 'etapa_formativa_encoded', 
        'tipo_asignatura_encoded', 'estado_alumno_encoded'
    ]
    
    features = pd.DataFrame([features_data])
    
    # Asegurar que todas las columnas existan
    for col in feature_columns:
        if col not in features.columns:
            features[col] = 0
    
    features = features[feature_columns]
    
    # Realizar predicciones
    # Clasificación: probabilidad de reprobar
    prob_reprobar = rf_model.predict_proba(features)[0][1]  # Probabilidad de clase 1 (reprobar)
    
    # Regresión: calificación estimada
    calificacion_estimada = reg_model.predict(features)[0]
    
    # Determinar nivel de riesgo
    if prob_reprobar >= 0.7 or calificacion_estimada < 7:
        riesgo = "ALTO"
    elif prob_reprobar >= 0.4 or calificacion_estimada < 8:
        riesgo = "MEDIO"
    else:
        riesgo = "BAJO"
    
    # Actualizar evaluación con predicciones
    evaluacion.prediccion_reprobacion = float(prob_reprobar)
    evaluacion.calificacion_estimada = float(calificacion_estimada)
    evaluacion.riesgo_academico = riesgo
    db.commit()
    
    return {
        "evaluacion_id": evaluacion.id,
        "matricula": evaluacion.matricula,
        "alumno": evaluacion.alumno,
        "calificacion_actual": evaluacion.calificacion,
        "prediccion_reprobacion": round(prob_reprobar, 4),
        "calificacion_estimada": round(calificacion_estimada, 2),
        "riesgo_academico": riesgo,
        "estado_evaluacion": evaluacion.estado_evaluacion or "N/A"
    }

def predict_por_matricula(matricula: str, db: Session):
    """
    Realizar predicción para todas las evaluaciones de un estudiante por matrícula
    """
    evaluaciones = db.query(Evaluacion).filter(Evaluacion.matricula == matricula).all()
    
    if not evaluaciones:
        raise HTTPException(
            status_code=404,
            detail=f"No se encontraron evaluaciones para la matrícula {matricula}"
        )
    
    resultados = []
    for evaluacion in evaluaciones:
        try:
            prediccion = predict_evaluacion(evaluacion.id, db)
            resultados.append(prediccion)
        except Exception as e:
            continue
    
    if not resultados:
        raise HTTPException(
            status_code=500,
            detail="No se pudieron realizar predicciones para ninguna evaluación"
        )
    
    # Calcular promedio de riesgo
    riesgos_alto = sum(1 for r in resultados if r['riesgo_academico'] == 'ALTO')
    promedio_prob_reprobacion = sum(r['prediccion_reprobacion'] for r in resultados) / len(resultados)
    
    return {
        "matricula": matricula,
        "alumno": resultados[0]['alumno'],
        "total_evaluaciones": len(resultados),
        "evaluaciones_riesgo_alto": riesgos_alto,
        "promedio_probabilidad_reprobacion": round(promedio_prob_reprobacion, 4),
        "evaluaciones": resultados
    }

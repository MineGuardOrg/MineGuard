import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error, r2_score
import joblib
import os
from app.models.student import Student

def train_models(db: Session):
    """
    Entrenar modelos de Machine Learning:
    1. Clasificación: RandomForestClassifier para predecir reprobación
    2. Regresión: DecisionTreeRegressor para predecir calificación
    """
    
    # Obtener datos de la base de datos
    students = db.query(Student).all()
    
    if len(students) < 10:
        return {
            "error": "Se necesitan al menos 10 registros para entrenar los modelos",
            "students_count": len(students)
        }
    
    # Convertir a DataFrame
    data = []
    for student in students:
        data.append({
            'edad': student.edad,
            'promedio_anterior': student.promedio_anterior,
            'asistencia': student.asistencia,
            'horas_estudio': student.horas_estudio,
            'participacion': student.participacion,
            'calificacion_actual': student.calificacion_actual,
            'reprobo': student.reprobo
        })
    
    df = pd.DataFrame(data)
    
    # Eliminar filas con valores nulos
    df = df.dropna()
    
    if len(df) < 10:
        return {
            "error": "Después de limpiar datos, quedan menos de 10 registros válidos",
            "valid_records": len(df)
        }
    
    # Features para entrenamiento
    feature_columns = ['edad', 'promedio_anterior', 'asistencia', 'horas_estudio', 'participacion']
    X = df[feature_columns]
    
    # === MODELO DE CLASIFICACIÓN ===
    y_classification = df['reprobo']
    
    X_train_clf, X_test_clf, y_train_clf, y_test_clf = train_test_split(
        X, y_classification, test_size=0.2, random_state=42
    )
    
    clf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )
    clf_model.fit(X_train_clf, y_train_clf)
    
    y_pred_clf = clf_model.predict(X_test_clf)
    clf_accuracy = accuracy_score(y_test_clf, y_pred_clf)
    
    # Guardar modelo de clasificación
    os.makedirs('models', exist_ok=True)
    joblib.dump(clf_model, 'models/model_clasificacion.joblib')
    
    # === MODELO DE REGRESIÓN ===
    y_regression = df['calificacion_actual']
    
    X_train_reg, X_test_reg, y_train_reg, y_test_reg = train_test_split(
        X, y_regression, test_size=0.2, random_state=42
    )
    
    reg_model = DecisionTreeRegressor(
        max_depth=10,
        random_state=42
    )
    reg_model.fit(X_train_reg, y_train_reg)
    
    y_pred_reg = reg_model.predict(X_test_reg)
    reg_mse = mean_squared_error(y_test_reg, y_pred_reg)
    reg_r2 = r2_score(y_test_reg, y_pred_reg)
    
    # Guardar modelo de regresión
    joblib.dump(reg_model, 'models/model_regresion.joblib')
    
    return {
        "message": "Modelos entrenados exitosamente",
        "clasificacion": {
            "accuracy": round(clf_accuracy, 4),
            "samples_trained": len(X_train_clf),
            "samples_tested": len(X_test_clf)
        },
        "regresion": {
            "mse": round(reg_mse, 4),
            "r2_score": round(reg_r2, 4),
            "samples_trained": len(X_train_reg),
            "samples_tested": len(X_test_reg)
        },
        "total_records": len(df),
        "features_used": feature_columns
    }

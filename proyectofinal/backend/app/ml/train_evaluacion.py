import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error, r2_score, confusion_matrix
from sklearn.preprocessing import LabelEncoder
import joblib
import os
from app.models.evaluacion import Evaluacion

def train_models_evaluacion(db: Session):
    """
    Entrenar modelos de Machine Learning con el dataset académico completo:
    1. Clasificación: RandomForestClassifier + LogisticRegression para predecir reprobación
    2. Regresión: DecisionTreeRegressor para predecir calificación
    Usa variables como: turno, modalidad, docente, campus, programa, etc.
    """
    
    # Obtener datos
    evaluaciones = db.query(Evaluacion).all()
    
    if len(evaluaciones) < 5:
        return {
            "error": "Se necesitan al menos 5 registros para entrenar los modelos",
            "evaluaciones_count": len(evaluaciones)
        }
    
    # Convertir a DataFrame
    data = []
    for ev in evaluaciones:
        data.append({
            'calificacion': ev.calificacion,
            'reprobo': ev.reprobo,
            'turno': ev.turno,
            'modalidad': ev.modalidad,
            'campus': ev.campus,
            'programa': ev.programa,
            'numero_periodo': ev.numero_periodo,
            'creditos': ev.creditos,
            'etapa_formativa': ev.etapa_formativa,
            'tipo_asignatura': ev.tipo_asignatura,
            'estado_alumno': ev.estado_alumno,
            'docente': ev.docente,
            'curso': ev.curso
        })
    
    df = pd.DataFrame(data)
    
    # Eliminar filas con valores nulos en columnas críticas
    df = df.dropna(subset=['calificacion', 'reprobo'])
    
    if len(df) < 5:
        return {
            "error": "Después de limpiar datos, quedan menos de 5 registros válidos",
            "valid_records": len(df)
        }
    
    # === CODIFICACIÓN DE VARIABLES CATEGÓRICAS ===
    categorical_columns = ['turno', 'modalidad', 'campus', 'programa', 
                          'etapa_formativa', 'tipo_asignatura', 'estado_alumno']
    
    label_encoders = {}
    for col in categorical_columns:
        if col in df.columns:
            le = LabelEncoder()
            # Rellenar NaN con 'Desconocido' antes de codificar
            df[col] = df[col].fillna('Desconocido')
            df[col + '_encoded'] = le.fit_transform(df[col])
            label_encoders[col] = le
    
    # Guardar los encoders
    os.makedirs('models', exist_ok=True)
    joblib.dump(label_encoders, 'models/label_encoders.joblib')
    
    # === FEATURES PARA ENTRENAMIENTO ===
    feature_columns = [
        'numero_periodo', 'creditos',
        'turno_encoded', 'modalidad_encoded', 'campus_encoded',
        'programa_encoded', 'etapa_formativa_encoded', 
        'tipo_asignatura_encoded', 'estado_alumno_encoded'
    ]
    
    # Filtrar solo columnas que existen
    feature_columns = [col for col in feature_columns if col in df.columns]
    
    # Rellenar NaN en features numéricas
    X = df[feature_columns].fillna(0)
    
    # === MODELO DE CLASIFICACIÓN ===
    y_classification = df['reprobo']
    
    X_train_clf, X_test_clf, y_train_clf, y_test_clf = train_test_split(
        X, y_classification, test_size=0.2, random_state=42, stratify=y_classification
    )
    
    # RandomForest
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight='balanced'
    )
    rf_model.fit(X_train_clf, y_train_clf)
    
    y_pred_rf = rf_model.predict(X_test_clf)
    rf_accuracy = accuracy_score(y_test_clf, y_pred_rf)
    rf_conf_matrix = confusion_matrix(y_test_clf, y_pred_rf)
    
    # Logistic Regression
    lr_model = LogisticRegression(random_state=42, max_iter=1000, class_weight='balanced')
    lr_model.fit(X_train_clf, y_train_clf)
    
    y_pred_lr = lr_model.predict(X_test_clf)
    lr_accuracy = accuracy_score(y_test_clf, y_pred_lr)
    
    # Guardar modelos de clasificación
    joblib.dump(rf_model, 'models/model_clasificacion_rf.joblib')
    joblib.dump(lr_model, 'models/model_clasificacion_lr.joblib')
    
    # === MODELO DE REGRESIÓN ===
    y_regression = df['calificacion']
    
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
    reg_rmse = np.sqrt(reg_mse)
    
    # Guardar modelo de regresión
    joblib.dump(reg_model, 'models/model_regresion.joblib')
    
    # === FEATURE IMPORTANCE ===
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': rf_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    return {
        "message": "Modelos entrenados exitosamente con dataset académico",
        "clasificacion_random_forest": {
            "accuracy": round(rf_accuracy, 4),
            "confusion_matrix": rf_conf_matrix.tolist(),
            "samples_trained": len(X_train_clf),
            "samples_tested": len(X_test_clf)
        },
        "clasificacion_logistic_regression": {
            "accuracy": round(lr_accuracy, 4),
            "samples_trained": len(X_train_clf),
            "samples_tested": len(X_test_clf)
        },
        "regresion": {
            "mse": round(reg_mse, 4),
            "rmse": round(reg_rmse, 4),
            "r2_score": round(reg_r2, 4),
            "samples_trained": len(X_train_reg),
            "samples_tested": len(X_test_reg)
        },
        "total_records": len(df),
        "features_used": feature_columns,
        "feature_importance": feature_importance.head(10).to_dict('records')
    }

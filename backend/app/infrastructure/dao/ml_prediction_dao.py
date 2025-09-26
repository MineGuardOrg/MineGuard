# DAO para predicciones ML
from app.domain.entities.ml_prediction import MLPrediction
from app.infrastructure.database import SessionLocal

class MLPredictionDAO:
    @staticmethod
    def get_by_id(prediction_id: int):
        with SessionLocal() as db:
            return db.query(MLPrediction).filter(MLPrediction.id == prediction_id, MLPrediction.is_active == True).first()

    @staticmethod
    def soft_delete(prediction_id: int):
        with SessionLocal() as db:
            prediction = db.query(MLPrediction).filter(MLPrediction.id == prediction_id, MLPrediction.is_active == True).first()
            if prediction:
                prediction.is_active = False
                db.commit()
            return prediction

    @staticmethod
    def create(prediction_data: dict):
        with SessionLocal() as db:
            prediction = MLPrediction(**prediction_data)
            db.add(prediction)
            db.commit()
            db.refresh(prediction)
            return prediction

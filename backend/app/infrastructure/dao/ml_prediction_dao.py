# DAO para predicciones ML
from app.domain.entities.ml_prediction import MLPrediction
from app.infrastructure.database import SessionLocal

class MLPredictionDAO:
    @staticmethod
    def get_by_id(prediction_id: int):
        db = SessionLocal()
        prediction = db.query(MLPrediction).filter(MLPrediction.id == prediction_id, MLPrediction.is_active == True).first()
        db.close()
        return prediction

    @staticmethod
    def soft_delete(prediction_id: int):
        db = SessionLocal()
        prediction = db.query(MLPrediction).filter(MLPrediction.id == prediction_id, MLPrediction.is_active == True).first()
        if prediction:
            prediction.is_active = False
            db.commit()
        db.close()
        return prediction

    @staticmethod
    def create(prediction_data: dict):
        db = SessionLocal()
        prediction = MLPrediction(**prediction_data)
        db.add(prediction)
        db.commit()
        db.refresh(prediction)
        db.close()
        return prediction

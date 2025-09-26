# DAO para datos de entrenamiento ML
from app.domain.entities.ml_training_data import MLTrainingData
from app.infrastructure.database import SessionLocal

class MLTrainingDataDAO:
    @staticmethod
    def get_by_id(training_id: int):
        with SessionLocal() as db:
            return db.query(MLTrainingData).filter(MLTrainingData.id == training_id, MLTrainingData.is_active == True).first()

    @staticmethod
    def soft_delete(training_id: int):
        with SessionLocal() as db:
            training = db.query(MLTrainingData).filter(MLTrainingData.id == training_id, MLTrainingData.is_active == True).first()
            if training:
                training.is_active = False
                db.commit()
            return training

    @staticmethod
    def create(training_data: dict):
        with SessionLocal() as db:
            training = MLTrainingData(**training_data)
            db.add(training)
            db.commit()
            db.refresh(training)
            return training

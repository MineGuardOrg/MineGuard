# Repositorio del módulo ML Prediction
from typing import List
from app.shared.base_repository import BaseRepository
from app.modules.ml_prediction.models import MLPrediction
from app.core.database import SessionLocal


class MLPredictionRepository(BaseRepository[MLPrediction]):
    def __init__(self):
        super().__init__(MLPrediction)

    def get_by_reading(self, reading_id: int) -> List[MLPrediction]:
        with SessionLocal() as db:
            return db.query(self.model).filter(self.model.reading_id == reading_id).all()

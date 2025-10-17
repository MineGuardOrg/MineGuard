# Repositorio del módulo ML Training Data
from typing import List
from app.shared.base_repository import BaseRepository
from app.modules.ml_training_data.models import MLTrainingData
from app.core.database import SessionLocal


class MLTrainingDataRepository(BaseRepository[MLTrainingData]):
    def __init__(self):
        super().__init__(MLTrainingData)

    def get_by_reading(self, reading_id: int) -> List[MLTrainingData]:
        with SessionLocal() as db:
            return db.query(self.model).filter(self.model.reading_id == reading_id).all()

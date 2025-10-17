# Servicio del módulo ML Training Data
import logging
from typing import Dict, Any, List
from fastapi import HTTPException, status

from app.shared.base_service import BaseService
from app.modules.ml_training_data.models import (
    MLTrainingData,
    MLTrainingDataCreateSchema,
    MLTrainingDataUpdateSchema,
    MLTrainingDataSchema,
)
from app.modules.ml_training_data.repository import MLTrainingDataRepository

logger = logging.getLogger(__name__)


class MLTrainingDataService(BaseService[MLTrainingData, MLTrainingDataCreateSchema, MLTrainingDataUpdateSchema, MLTrainingDataSchema]):
    def __init__(self):
        self.repository = MLTrainingDataRepository()
        super().__init__(self.repository)

    def _validate_create_data(self, data: MLTrainingDataCreateSchema) -> Dict[str, Any]:
        return data.dict()

    def _validate_update_data(self, id: int, data: MLTrainingDataUpdateSchema) -> Dict[str, Any]:
        return {k: v for k, v in data.dict().items() if v is not None}

    def _to_response_schema(self, entity: MLTrainingData) -> MLTrainingDataSchema:
        return MLTrainingDataSchema.from_orm(entity)

    def get_by_reading(self, reading_id: int) -> List[MLTrainingDataSchema]:
        try:
            items = self.repository.get_by_reading(reading_id)
            return [self._to_response_schema(it) for it in items]
        except Exception as e:
            logger.error(f"Error al obtener training data por lectura {reading_id}: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")

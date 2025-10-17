# Servicio del módulo ML Prediction
import logging
from typing import Dict, Any, List
from fastapi import HTTPException, status

from app.shared.base_service import BaseService
from app.modules.ml_prediction.models import (
    MLPrediction,
    MLPredictionCreateSchema,
    MLPredictionUpdateSchema,
    MLPredictionSchema,
)
from app.modules.ml_prediction.repository import MLPredictionRepository

logger = logging.getLogger(__name__)


class MLPredictionService(BaseService[MLPrediction, MLPredictionCreateSchema, MLPredictionUpdateSchema, MLPredictionSchema]):
    def __init__(self):
        self.repository = MLPredictionRepository()
        super().__init__(self.repository)

    def _validate_create_data(self, data: MLPredictionCreateSchema) -> Dict[str, Any]:
        return data.dict()

    def _validate_update_data(self, id: int, data: MLPredictionUpdateSchema) -> Dict[str, Any]:
        return {k: v for k, v in data.dict().items() if v is not None}

    def _to_response_schema(self, entity: MLPrediction) -> MLPredictionSchema:
        return MLPredictionSchema.from_orm(entity)

    def get_by_reading(self, reading_id: int) -> List[MLPredictionSchema]:
        try:
            items = self.repository.get_by_reading(reading_id)
            return [self._to_response_schema(it) for it in items]
        except Exception as e:
            logger.error(f"Error al obtener predicciones por lectura {reading_id}: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")

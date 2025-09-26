from app.infrastructure.dao.ml_prediction_dao import MLPredictionDAO
from app.domain.schemas.ml_prediction_schema import MLPredictionSchema

class MLPredictionService:
    @staticmethod
    def get_all_ml_predictions():
        predictions = MLPredictionDAO.get_all()
        return [MLPredictionSchema.from_orm(pred) for pred in predictions]

    @staticmethod
    def get_ml_prediction_by_id(prediction_id: int):
        prediction = MLPredictionDAO.get_by_id(prediction_id)
        if prediction:
            return MLPredictionSchema.from_orm(prediction)
        return None

    @staticmethod
    def create_ml_prediction(prediction_data: dict):
        prediction = MLPredictionDAO.create(prediction_data)
        return MLPredictionSchema.from_orm(prediction)

    @staticmethod
    def soft_delete_ml_prediction(prediction_id: int):
        prediction = MLPredictionDAO.soft_delete(prediction_id)
        return bool(prediction)

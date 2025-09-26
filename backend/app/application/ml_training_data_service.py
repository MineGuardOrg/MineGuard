from app.infrastructure.dao.ml_training_data_dao import MLTrainingDataDAO
from app.domain.schemas.ml_training_data_schema import MLTrainingDataSchema

class MLTrainingDataService:
    @staticmethod
    def get_all_ml_training_data():
        data = MLTrainingDataDAO.get_all()
        return [MLTrainingDataSchema.from_orm(d) for d in data]

    @staticmethod
    def get_ml_training_data_by_id(data_id: int):
        d = MLTrainingDataDAO.get_by_id(data_id)
        if d:
            return MLTrainingDataSchema.from_orm(d)
        return None

    @staticmethod
    def create_ml_training_data(data_dict: dict):
        d = MLTrainingDataDAO.create(data_dict)
        return MLTrainingDataSchema.from_orm(d)

    @staticmethod
    def soft_delete_ml_training_data(data_id: int):
        d = MLTrainingDataDAO.soft_delete(data_id)
        return bool(d)

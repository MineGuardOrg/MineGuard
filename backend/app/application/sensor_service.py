from app.infrastructure.dao.sensor_dao import SensorDAO
from app.domain.schemas.sensor_schema import SensorSchema

class SensorService:
    @staticmethod
    def get_all_sensors():
        sensors = SensorDAO.get_all()
        return [SensorSchema.from_orm(s) for s in sensors]

    @staticmethod
    def get_sensor_by_id(sensor_id: int):
        s = SensorDAO.get_by_id(sensor_id)
        if s:
            return SensorSchema.from_orm(s)
        return None

    @staticmethod
    def create_sensor(sensor_data: dict):
        s = SensorDAO.create(sensor_data)
        return SensorSchema.from_orm(s)

    @staticmethod
    def soft_delete_sensor(sensor_id: int):
        s = SensorDAO.soft_delete(sensor_id)
        return bool(s)

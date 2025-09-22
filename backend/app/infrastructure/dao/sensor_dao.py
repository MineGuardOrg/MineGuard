# DAO para sensores
from app.domain.entities.sensor import Sensor
from app.infrastructure.database import SessionLocal

class SensorDAO:
    @staticmethod
    def get_by_id(sensor_id: int):
        db = SessionLocal()
        sensor = db.query(Sensor).filter(Sensor.id == sensor_id, Sensor.is_active == True).first()
        db.close()
        return sensor

    @staticmethod
    def soft_delete(sensor_id: int):
        db = SessionLocal()
        sensor = db.query(Sensor).filter(Sensor.id == sensor_id, Sensor.is_active == True).first()
        if sensor:
            sensor.is_active = False
            db.commit()
        db.close()
        return sensor

    @staticmethod
    def create(sensor_data: dict):
        db = SessionLocal()
        sensor = Sensor(**sensor_data)
        db.add(sensor)
        db.commit()
        db.refresh(sensor)
        db.close()
        return sensor

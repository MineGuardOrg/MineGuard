# Repositorio del módulo Sensor
from typing import List
from app.shared.base_repository import BaseRepository
from app.modules.sensor.models import Sensor
from app.core.database import SessionLocal


class SensorRepository(BaseRepository[Sensor]):
    def __init__(self):
        super().__init__(Sensor)

    def get_by_device(self, device_id: int) -> List[Sensor]:
        with SessionLocal() as db:
            return db.query(self.model).filter(
                self.model.device_id == device_id,
                self.model.is_active == True
            ).all()

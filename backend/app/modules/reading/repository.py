# Repositorio del módulo Reading
from datetime import datetime
from typing import List, Optional
from sqlalchemy import and_
from app.shared.base_repository import BaseRepository
from app.modules.reading.models import Reading
from app.core.database import SessionLocal


class ReadingRepository(BaseRepository[Reading]):
    def __init__(self):
        super().__init__(Reading)

    def get_by_sensor(self, sensor_id: int, start: Optional[datetime] = None, end: Optional[datetime] = None) -> List[Reading]:
        with SessionLocal() as db:
            q = db.query(self.model).filter(self.model.sensor_id == sensor_id)
            if start:
                q = q.filter(self.model.timestamp >= start)
            if end:
                q = q.filter(self.model.timestamp <= end)
            return q.all()

    def get_by_user(self, user_id: int, limit: int = 100) -> List[Reading]:
        with SessionLocal() as db:
            return db.query(self.model).filter(self.model.user_id == user_id).order_by(self.model.id.desc()).limit(limit).all()

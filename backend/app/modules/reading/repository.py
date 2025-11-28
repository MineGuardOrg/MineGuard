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

    def get_by_device(self, device_id: int, start: Optional[datetime] = None, end: Optional[datetime] = None) -> List[Reading]:
        """
        Obtiene lecturas de todos los sensores para un dispositivo específico
        """
        with SessionLocal() as db:
            q = db.query(self.model).filter(self.model.device_id == device_id)
            if start:
                q = q.filter(self.model.timestamp >= start)
            if end:
                q = q.filter(self.model.timestamp <= end)
            return q.order_by(self.model.timestamp.desc()).all()

    def get_by_user(self, user_id: int, limit: int = 100) -> List[Reading]:
        """
        Obtiene las últimas lecturas de un usuario (todas las lecturas de sensores)
        """
        with SessionLocal() as db:
            return db.query(self.model).filter(self.model.user_id == user_id).order_by(self.model.timestamp.desc()).limit(limit).all()
    
    def get_latest_by_device(self, device_id: int) -> Optional[Reading]:
        """
        Obtiene la última lectura de un dispositivo (incluye todos los sensores)
        """
        with SessionLocal() as db:
            return db.query(self.model).filter(self.model.device_id == device_id).order_by(self.model.timestamp.desc()).first()

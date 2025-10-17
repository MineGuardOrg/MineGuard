# Repositorio del módulo Alert
from typing import List
from app.shared.base_repository import BaseRepository
from app.modules.alert.models import Alert
from app.core.database import SessionLocal


class AlertRepository(BaseRepository[Alert]):
    def __init__(self):
        super().__init__(Alert)

    def get_by_reading(self, reading_id: int) -> List[Alert]:
        with SessionLocal() as db:
            return db.query(self.model).filter(self.model.reading_id == reading_id).all()

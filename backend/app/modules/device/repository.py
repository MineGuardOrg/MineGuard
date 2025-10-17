# Repositorio del módulo Device
from typing import List
from app.shared.base_repository import BaseRepository
from app.modules.device.models import Device
from app.core.database import SessionLocal


class DeviceRepository(BaseRepository[Device]):
    def __init__(self):
        super().__init__(Device)

    def get_by_user(self, user_id: int) -> List[Device]:
        with SessionLocal() as db:
            return db.query(self.model).filter(
                self.model.user_id == user_id,
                getattr(self.model, "is_active", True) == True
            ).all()

# Repositorio del módulo Maintenance Log
from typing import List
from app.shared.base_repository import BaseRepository
from app.modules.maintenance_log.models import MaintenanceLog
from app.core.database import SessionLocal


class MaintenanceLogRepository(BaseRepository[MaintenanceLog]):
    def __init__(self):
        super().__init__(MaintenanceLog)

    def get_by_device(self, device_id: int) -> List[MaintenanceLog]:
        with SessionLocal() as db:
            return db.query(self.model).filter(self.model.device_id == device_id).all()

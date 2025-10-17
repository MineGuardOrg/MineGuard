# Repositorio del módulo Connection
from typing import List
from app.shared.base_repository import BaseRepository
from app.modules.connection.models import Connection
from app.core.database import SessionLocal


class ConnectionRepository(BaseRepository[Connection]):
    def __init__(self):
        super().__init__(Connection)

    def get_by_device(self, device_id: int) -> List[Connection]:
        with SessionLocal() as db:
            return db.query(self.model).filter(self.model.device_id == device_id).all()

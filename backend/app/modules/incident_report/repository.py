# Repositorio del módulo Incident Report
from typing import List
from app.shared.base_repository import BaseRepository
from app.modules.incident_report.models import IncidentReport
from app.core.database import SessionLocal


class IncidentReportRepository(BaseRepository[IncidentReport]):
    def __init__(self):
        super().__init__(IncidentReport)

    def get_by_user(self, user_id: int) -> List[IncidentReport]:
        with SessionLocal() as db:
            return db.query(self.model).filter(self.model.user_id == user_id).all()

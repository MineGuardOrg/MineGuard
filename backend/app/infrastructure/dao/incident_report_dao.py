# DAO para reportes de incidentes
from app.domain.entities.incident_report import IncidentReport
from app.infrastructure.database import SessionLocal

class IncidentReportDAO:
    @staticmethod
    def get_by_id(incident_id: int):
        with SessionLocal() as db:
            return db.query(IncidentReport).filter(IncidentReport.id == incident_id, IncidentReport.is_active == True).first()

    @staticmethod
    def soft_delete(incident_id: int):
        with SessionLocal() as db:
            incident = db.query(IncidentReport).filter(IncidentReport.id == incident_id, IncidentReport.is_active == True).first()
            if incident:
                incident.is_active = False
                db.commit()
            return incident

    @staticmethod
    def create(incident_data: dict):
        with SessionLocal() as db:
            incident = IncidentReport(**incident_data)
            db.add(incident)
            db.commit()
            db.refresh(incident)
            return incident

# DAO para reportes de incidentes
from app.domain.entities.incident_report import IncidentReport
from app.infrastructure.database import SessionLocal

class IncidentReportDAO:
    @staticmethod
    def get_by_id(incident_id: int):
        db = SessionLocal()
        incident = db.query(IncidentReport).filter(IncidentReport.id == incident_id, IncidentReport.is_active == True).first()
        db.close()
        return incident

    @staticmethod
    def soft_delete(incident_id: int):
        db = SessionLocal()
        incident = db.query(IncidentReport).filter(IncidentReport.id == incident_id, IncidentReport.is_active == True).first()
        if incident:
            incident.is_active = False
            db.commit()
        db.close()
        return incident

    @staticmethod
    def create(incident_data: dict):
        db = SessionLocal()
        incident = IncidentReport(**incident_data)
        db.add(incident)
        db.commit()
        db.refresh(incident)
        db.close()
        return incident

# DAO para alertas
from app.domain.entities.alert import Alert
from app.infrastructure.database import SessionLocal

class AlertDAO:
    @staticmethod
    def get_by_id(alert_id: int):
        db = SessionLocal()
        alert = db.query(Alert).filter(Alert.id == alert_id, Alert.is_active == True).first()
        db.close()
        return alert

    @staticmethod
    def soft_delete(alert_id: int):
        db = SessionLocal()
        alert = db.query(Alert).filter(Alert.id == alert_id, Alert.is_active == True).first()
        if alert:
            alert.is_active = False
            db.commit()
        db.close()
        return alert

    @staticmethod
    def create(alert_data: dict):
        db = SessionLocal()
        alert = Alert(**alert_data)
        db.add(alert)
        db.commit()
        db.refresh(alert)
        db.close()
        return alert

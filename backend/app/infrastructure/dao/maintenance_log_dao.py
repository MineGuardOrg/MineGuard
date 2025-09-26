# DAO para logs de mantenimiento
from app.domain.entities.maintenance_log import MaintenanceLog
from app.infrastructure.database import SessionLocal

class MaintenanceLogDAO:
    @staticmethod
    def get_by_id(log_id: int):
        with SessionLocal() as db:
            return db.query(MaintenanceLog).filter(MaintenanceLog.id == log_id, MaintenanceLog.is_active == True).first()

    @staticmethod
    def soft_delete(log_id: int):
        with SessionLocal() as db:
            log = db.query(MaintenanceLog).filter(MaintenanceLog.id == log_id, MaintenanceLog.is_active == True).first()
            if log:
                log.is_active = False
                db.commit()
            return log

    @staticmethod
    def create(log_data: dict):
        with SessionLocal() as db:
            log = MaintenanceLog(**log_data)
            db.add(log)
            db.commit()
            db.refresh(log)
            return log

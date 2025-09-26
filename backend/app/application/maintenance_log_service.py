from app.infrastructure.dao.maintenance_log_dao import MaintenanceLogDAO
from app.domain.schemas.maintenance_log_schema import MaintenanceLogSchema

class MaintenanceLogService:
    @staticmethod
    def get_all_maintenance_logs():
        logs = MaintenanceLogDAO.get_all()
        return [MaintenanceLogSchema.from_orm(log) for log in logs]

    @staticmethod
    def get_maintenance_log_by_id(log_id: int):
        log = MaintenanceLogDAO.get_by_id(log_id)
        if log:
            return MaintenanceLogSchema.from_orm(log)
        return None

    @staticmethod
    def create_maintenance_log(log_data: dict):
        log = MaintenanceLogDAO.create(log_data)
        return MaintenanceLogSchema.from_orm(log)

    @staticmethod
    def soft_delete_maintenance_log(log_id: int):
        log = MaintenanceLogDAO.soft_delete(log_id)
        return bool(log)

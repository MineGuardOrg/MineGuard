from app.infrastructure.dao.alert_dao import AlertDAO
from app.domain.schemas.alert_schema import AlertSchema

class AlertService:
    @staticmethod
    def get_all_alerts():
        alerts = AlertDAO.get_all()
        return [AlertSchema.from_orm(alert) for alert in alerts]

    @staticmethod
    def get_alert_by_id(alert_id: int):
        alert = AlertDAO.get_by_id(alert_id)
        if alert:
            return AlertSchema.from_orm(alert)
        return None

    @staticmethod
    def create_alert(alert_data: dict):
        alert = AlertDAO.create(alert_data)
        return AlertSchema.from_orm(alert)

    @staticmethod
    def soft_delete_alert(alert_id: int):
        alert = AlertDAO.soft_delete(alert_id)
        return bool(alert)

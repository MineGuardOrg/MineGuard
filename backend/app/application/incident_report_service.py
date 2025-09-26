from app.infrastructure.dao.incident_report_dao import IncidentReportDAO
from app.domain.schemas.incident_report_schema import IncidentReportSchema

class IncidentReportService:
    @staticmethod
    def get_all_incident_reports():
        reports = IncidentReportDAO.get_all()
        return [IncidentReportSchema.from_orm(report) for report in reports]

    @staticmethod
    def get_incident_report_by_id(report_id: int):
        report = IncidentReportDAO.get_by_id(report_id)
        if report:
            return IncidentReportSchema.from_orm(report)
        return None

    @staticmethod
    def create_incident_report(report_data: dict):
        report = IncidentReportDAO.create(report_data)
        return IncidentReportSchema.from_orm(report)

    @staticmethod
    def soft_delete_incident_report(report_id: int):
        report = IncidentReportDAO.soft_delete(report_id)
        return bool(report)

from fastapi import APIRouter, HTTPException
from app.application.incident_report_service import IncidentReportService
from app.domain.schemas.incident_report_schema import IncidentReportSchema

incident_report_router = APIRouter()

@incident_report_router.get("/", response_model=list[IncidentReportSchema])
def get_all_incident_reports():
    return IncidentReportService.get_all_incident_reports()

@incident_report_router.get("/{report_id}", response_model=IncidentReportSchema)
def get_incident_report(report_id: int):
    report = IncidentReportService.get_incident_report_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    return report

@incident_report_router.post("/", response_model=IncidentReportSchema)
def create_incident_report(report: IncidentReportSchema):
    report_dict = report.dict(exclude_unset=True)
    new_report = IncidentReportService.create_incident_report(report_dict)
    return new_report

@incident_report_router.delete("/{report_id}")
def delete_incident_report(report_id: int):
    result = IncidentReportService.soft_delete_incident_report(report_id)
    if not result:
        raise HTTPException(status_code=404, detail="Reporte no encontrado o ya eliminado")
    return {"message": "Reporte eliminado (soft delete)"}

# Router del módulo Incident Report
# Los reportes de incidentes son datos históricos inmutables (solo lectura)
from fastapi import APIRouter, Depends
from typing import List
from app.modules.incident_report.models import IncidentReportSchema
from app.modules.incident_report.service import IncidentReportService
from app.core.security import get_current_user

incident_report_router = APIRouter()
service = IncidentReportService()


@incident_report_router.get("/", response_model=List[IncidentReportSchema])
def get_all(current_user=Depends(get_current_user)):
    return service.get_all()


@incident_report_router.get("/{incident_id}", response_model=IncidentReportSchema)
def get_by_id(incident_id: int, current_user=Depends(get_current_user)):
    return service.get_by_id(incident_id)


@incident_report_router.get("/by-user/{user_id}", response_model=List[IncidentReportSchema])
def by_user(user_id: int, current_user=Depends(get_current_user)):
    return service.get_by_user(user_id)

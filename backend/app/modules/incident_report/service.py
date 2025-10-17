# Servicio del módulo Incident Report
import logging
from typing import Dict, Any, List
from fastapi import HTTPException, status

from app.shared.base_service import BaseService
from app.shared.exceptions import ValidationError
from app.modules.incident_report.models import (
    IncidentReport,
    IncidentReportCreateSchema,
    IncidentReportUpdateSchema,
    IncidentReportSchema,
)
from app.modules.incident_report.repository import IncidentReportRepository

logger = logging.getLogger(__name__)


class IncidentReportService(BaseService[IncidentReport, IncidentReportCreateSchema, IncidentReportUpdateSchema, IncidentReportSchema]):
    def __init__(self):
        self.repository = IncidentReportRepository()
        super().__init__(self.repository)

    def _validate_create_data(self, data: IncidentReportCreateSchema) -> Dict[str, Any]:
        return data.dict()

    def _validate_update_data(self, id: int, data: IncidentReportUpdateSchema) -> Dict[str, Any]:
        return {k: v for k, v in data.dict().items() if v is not None}

    def _to_response_schema(self, entity: IncidentReport) -> IncidentReportSchema:
        return IncidentReportSchema.from_orm(entity)

    def get_by_user(self, user_id: int) -> List[IncidentReportSchema]:
        try:
            items = self.repository.get_by_user(user_id)
            return [self._to_response_schema(it) for it in items]
        except Exception as e:
            logger.error(f"Error al obtener incidentes por usuario {user_id}: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")

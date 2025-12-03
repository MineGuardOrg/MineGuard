# Servicio del módulo Dashboard
from typing import List
from fastapi import HTTPException, status
import logging

from app.shared.base_service import BaseService
from app.modules.users.models import UserSchema
from app.modules.dashboard.models import (
    ActiveWorkerSchema, 
    AlertCountsLastMonthSchema, 
    BiometricsByAreaSchema, 
    RecentAlertItemSchema,
    CreateIncidentFromAlertSchema,
    IncidentCreatedResponseSchema
)
from app.modules.dashboard.repository import DashboardRepository

logger = logging.getLogger(__name__)


class DashboardService:
    """Servicio para consultas del Dashboard"""

    def __init__(self):
        self.repository = DashboardRepository()

    def get_miners_by_supervisor(self, supervisor_id: int) -> List[UserSchema]:
        try:
            users = self.repository.get_miners_by_supervisor(supervisor_id)
            return [UserSchema.from_orm(u) for u in users]
        except Exception as e:
            logger.error(f"Error al obtener mineros del supervisor {supervisor_id}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al obtener mineros"
            )

    def get_active_workers(self) -> List[ActiveWorkerSchema]:
        from datetime import datetime, timezone
        try:
            rows = self.repository.get_active_workers()
            result: List[ActiveWorkerSchema] = []
            now = datetime.now(timezone.utc)
            for r in rows:
                conn_ts = r.get('tiempoActivo_ts')
                if conn_ts is not None and conn_ts.tzinfo is None:
                    conn_ts = conn_ts.replace(tzinfo=timezone.utc)
                seconds_active = int((now - conn_ts).total_seconds()) if conn_ts else 0

                result.append(ActiveWorkerSchema(
                    id=r['id'],
                    nombre=r['nombre'],
                    numeroEmpleado=r['numeroEmpleado'],
                    area=r.get('area'),
                    ritmoCardiaco=r.get('ritmoCardiaco'),
                    temperaturaCorporal=r.get('temperaturaCorporal'),
                    nivelBateria=r.get('nivelBateria'),
                    tiempoActivo=seconds_active,
                    cascoId=r['cascoId']
                ))
            return result
        except Exception as e:
            logger.error(f"Error al obtener trabajadores activos: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al obtener trabajadores activos"
            )

    def get_active_workers_by_supervisor(self, supervisor_id: int) -> List[ActiveWorkerSchema]:
        from datetime import datetime, timezone
        try:
            rows = self.repository.get_active_workers_by_supervisor(supervisor_id)
            result: List[ActiveWorkerSchema] = []
            now = datetime.now(timezone.utc)
            for r in rows:
                conn_ts = r.get('tiempoActivo_ts')
                if conn_ts is not None and conn_ts.tzinfo is None:
                    conn_ts = conn_ts.replace(tzinfo=timezone.utc)
                seconds_active = int((now - conn_ts).total_seconds()) if conn_ts else 0

                result.append(ActiveWorkerSchema(
                    id=r['id'],
                    nombre=r['nombre'],
                    numeroEmpleado=r['numeroEmpleado'],
                    area=r.get('area'),
                    ritmoCardiaco=r.get('ritmoCardiaco'),
                    temperaturaCorporal=r.get('temperaturaCorporal'),
                    nivelBateria=r.get('nivelBateria'),
                    tiempoActivo=seconds_active,
                    cascoId=r['cascoId']
                ))
            return result
        except Exception as e:
            logger.error(f"Error al obtener trabajadores activos por supervisor: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al obtener trabajadores activos"
            )

    def get_alert_counts_last_month_by_type(self) -> AlertCountsLastMonthSchema:
        """Devuelve conteos de alertas por tipo para el último mes"""
        try:
            counts = self.repository.get_alert_counts_last_month_by_type()
            return AlertCountsLastMonthSchema(
                labels=[
                    'gasesToxicos',
                    'ritmoCardiacoAnormal',
                    'temperaturaCorporalAlta',
                    'caidasImpactos'
                ],
                **counts
            )
        except Exception as e:
            logger.error(f"Error al obtener conteo de alertas del último mes: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al obtener alertas"
            )

    def get_biometrics_avg_by_area(self, days: int = 30) -> BiometricsByAreaSchema:
        """Devuelve arrays con promedios de HR y temperatura por área en el rango indicado."""
        try:
            rows = self.repository.get_biometrics_avg_by_area(days)
            # Ordenar por nombre de área (repo ya devuelve ordenado pero reforzamos)
            rows = sorted(rows, key=lambda r: r['area'])
            return BiometricsByAreaSchema(
                areas=[r['area'] for r in rows],
                ritmoCardiaco=[r['hr_avg'] for r in rows],
                temperaturaCorporal=[r['temp_avg'] for r in rows]
            )
        except Exception as e:
            logger.error(f"Error al obtener promedios biométricos por área: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al obtener promedios biométricos"
            )

    def get_biometrics_avg_by_area_by_supervisor(self, supervisor_id: int, days: int = 30):
        """Devuelve promedios de HR y temperatura del área del supervisor."""
        from app.modules.dashboard.models import SupervisorAreaBiometricsSchema
        try:
            result = self.repository.get_supervisor_area_biometrics(supervisor_id, days)
            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No se encontraron datos biométricos para el área del supervisor"
                )
            return SupervisorAreaBiometricsSchema(
                area=result['area'],
                ritmoCardiaco=result['hr_avg'],
                temperaturaCorporal=result['temp_avg'],
                workerCount=result['worker_count']
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error al obtener promedios biométricos del área del supervisor: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al obtener promedios biométricos"
            )

    def get_incidents_by_supervisor(self, supervisor_id: int, days: int = 30, limit: int = 50):
        """Devuelve lista de incidentes creados por usuarios a cargo del supervisor."""
        from app.modules.dashboard.models import SupervisorIncidentItemSchema
        try:
            rows = self.repository.get_incidents_by_supervisor(supervisor_id, days, limit)
            return [SupervisorIncidentItemSchema(**row) for row in rows]
        except Exception as e:
            logger.error(f"Error al obtener incidentes del supervisor: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al obtener incidentes"
            )

    def get_recent_alerts(self, days: int = 7, limit: int = 20) -> List[RecentAlertItemSchema]:
        """Devuelve lista de alertas recientes con datos enriquecidos"""
        try:
            rows = self.repository.get_recent_alerts(days=days, limit=limit)
            return [RecentAlertItemSchema(**row) for row in rows]
        except Exception as e:
            logger.error(f"Error al obtener alertas recientes: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al obtener alertas recientes"
            )

    def get_recent_alerts_by_supervisor(self, supervisor_id: int, days: int = 7, limit: int = 20) -> List[RecentAlertItemSchema]:
        """Devuelve lista de alertas recientes filtradas por supervisor_id."""
        try:
            rows = self.repository.get_recent_alerts_by_supervisor(supervisor_id, days=days, limit=limit)
            return [RecentAlertItemSchema(**row) for row in rows]
        except Exception as e:
            logger.error(f"Error al obtener alertas recientes del supervisor: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al obtener alertas recientes"
            )

    def create_incident_from_alert(self, supervisor_id: int, data: CreateIncidentFromAlertSchema) -> IncidentCreatedResponseSchema:
        """Crea un incidente desde una alerta. Las alertas ya están filtradas por supervisor."""
        from datetime import datetime, timezone
        from app.core.database import SessionLocal
        from app.modules.incident_report.models import IncidentReport
        
        try:
            with SessionLocal() as db:
                # Crear el incidente directamente (las alertas ya están filtradas por supervisor)
                incident = IncidentReport(
                    description=data.description,
                    severity=data.severity,
                    user_id=data.user_id,
                    device_id=data.device_id,
                    reading_id=data.reading_id
                )
                
                db.add(incident)
                db.commit()
                db.refresh(incident)
                
                logger.info(f"Incidente creado por supervisor {supervisor_id} para usuario {data.user_id}: {incident.id}")
                
                return IncidentCreatedResponseSchema(
                    id=incident.id,
                    created_at=incident.created_at if incident.created_at else datetime.now(timezone.utc)
                )
                
        except Exception as e:
            logger.error(f"Error al crear incidente: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno del servidor al crear incidente"
            )

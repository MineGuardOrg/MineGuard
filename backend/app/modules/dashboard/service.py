# Servicio del módulo Dashboard
from typing import List
from fastapi import HTTPException, status
import logging

from app.shared.base_service import BaseService
from app.modules.users.models import UserSchema
from app.modules.dashboard.models import ActiveWorkerSchema, AlertCountsLastMonthSchema, BiometricsByAreaSchema, RecentAlertItemSchema
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
                    area=r.get('area'),
                    ritmoCardiaco=r.get('ritmoCardiaco'),
                    temperaturaCorpral=r.get('temperaturaCorpral'),
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

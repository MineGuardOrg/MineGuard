# Router del módulo Dashboard
from fastapi import APIRouter, Depends, Query
from typing import List

from app.core.security import get_current_user
from app.modules.users.models import UserSchema, User
from app.modules.dashboard.models import ActiveWorkerSchema, AlertCountsLastMonthSchema, BiometricsByAreaSchema, RecentAlertItemSchema
from app.modules.dashboard.service import DashboardService

# Crear instancia del router
dashboard_router = APIRouter()

# Instancia del servicio
_dashboard_service = DashboardService()


@dashboard_router.get("/supervisors/{supervisor_id}/miners", response_model=List[UserSchema])
def get_miners_by_supervisor(
    supervisor_id: int,
    current_user: User = Depends(get_current_user)
):
    """Obtiene los usuarios con posición 'Minero' asignados a un supervisor"""
    return _dashboard_service.get_miners_by_supervisor(supervisor_id)


@dashboard_router.get("/active-workers", response_model=List[ActiveWorkerSchema])
def get_active_workers(
    current_user: User = Depends(get_current_user)
):
    """Lista de trabajadores activos con métricas recientes del casco"""
    return _dashboard_service.get_active_workers()


@dashboard_router.get("/alerts/last-month-by-type", response_model=AlertCountsLastMonthSchema)
def get_alerts_last_month_by_type(
    current_user: User = Depends(get_current_user)
):
    """Conteo de alertas por tipo en el último mes para el dashboard"""
    return _dashboard_service.get_alert_counts_last_month_by_type()


@dashboard_router.get("/biometrics/avg-by-area", response_model=BiometricsByAreaSchema)
def get_biometrics_avg_by_area(
    days: int = Query(30, ge=1, le=365, description="Rango en días para calcular los promedios"),
    current_user: User = Depends(get_current_user)
):
    """Promedios de ritmo cardiaco y temperatura corporal por área en el rango indicado (por defecto 30 días)."""
    return _dashboard_service.get_biometrics_avg_by_area(days)


@dashboard_router.get("/alerts/recent", response_model=List[RecentAlertItemSchema])
def get_recent_alerts(
    days: int = Query(7, ge=1, le=90, description="Rango en días a consultar"),
    limit: int = Query(20, ge=1, le=200, description="Máximo de alertas a retornar"),
    current_user: User = Depends(get_current_user)
):
    """Alertas recientes ordenadas por timestamp DESC, con datos de trabajador, área, estado del casco y valor de lectura."""
    return _dashboard_service.get_recent_alerts(days=days, limit=limit)

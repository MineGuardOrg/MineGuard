# Router del módulo Dashboard
from fastapi import APIRouter, Depends, Query, status
from typing import List

from app.core.security import get_current_user
from app.modules.users.models import UserSchema, User
from app.modules.dashboard.models import (
    ActiveWorkerSchema, 
    AlertCountsLastMonthSchema, 
    BiometricsByAreaSchema, 
    RecentAlertItemSchema,
    CreateIncidentFromAlertSchema,
    IncidentCreatedResponseSchema,
    SupervisorAreaBiometricsSchema,
    SupervisorIncidentItemSchema
)
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


# ============================================================================
# ENDPOINTS ESPECÍFICOS PARA SUPERVISORES (filtrados por supervisor_id)
# ============================================================================

@dashboard_router.get("/supervisor/active-workers", response_model=List[ActiveWorkerSchema])
def get_supervisor_active_workers(
    current_user: User = Depends(get_current_user)
):
    """Lista de trabajadores activos del supervisor con métricas recientes del casco."""
    return _dashboard_service.get_active_workers_by_supervisor(current_user.id)


@dashboard_router.get("/supervisor/biometrics/avg-by-area", response_model=SupervisorAreaBiometricsSchema)
def get_supervisor_biometrics_avg_by_area(
    days: int = Query(30, ge=1, le=365, description="Rango en días para calcular los promedios"),
    current_user: User = Depends(get_current_user)
):
    """Promedios de ritmo cardiaco y temperatura corporal del área del supervisor."""
    return _dashboard_service.get_biometrics_avg_by_area_by_supervisor(current_user.id, days)


@dashboard_router.get("/supervisor/incidents", response_model=List[SupervisorIncidentItemSchema])
def get_supervisor_incidents(
    days: int = Query(30, ge=1, le=365, description="Rango en días a consultar"),
    limit: int = Query(50, ge=1, le=200, description="Máximo de incidentes a retornar"),
    current_user: User = Depends(get_current_user)
):
    """Lista de incidentes creados por usuarios a cargo del supervisor."""
    return _dashboard_service.get_incidents_by_supervisor(current_user.id, days=days, limit=limit)


@dashboard_router.get("/supervisor/alerts/recent", response_model=List[RecentAlertItemSchema])
def get_supervisor_recent_alerts(
    days: int = Query(7, ge=1, le=90, description="Rango en días a consultar"),
    limit: int = Query(20, ge=1, le=200, description="Máximo de alertas a retornar"),
    current_user: User = Depends(get_current_user)
):
    """Alertas recientes del supervisor ordenadas por timestamp DESC."""
    return _dashboard_service.get_recent_alerts_by_supervisor(current_user.id, days=days, limit=limit)


@dashboard_router.post("/supervisor/incident", response_model=IncidentCreatedResponseSchema, status_code=status.HTTP_201_CREATED)
def create_incident_from_alert(
    payload: CreateIncidentFromAlertSchema,
    current_user: User = Depends(get_current_user)
):
    """Crea un incidente desde una alerta. Solo puede crear incidentes de sus usuarios asignados."""
    return _dashboard_service.create_incident_from_alert(current_user.id, payload)


@dashboard_router.get("/supervisor/assigned-users", response_model=List[UserSchema])
def get_supervisor_assigned_users(
    current_user: User = Depends(get_current_user)
):
    """Obtiene la lista de usuarios asignados al supervisor para selección en formularios."""
    return _dashboard_service.get_miners_by_supervisor(current_user.id)

# Modelos del módulo Dashboard (Esquemas Pydantic)
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class ActiveWorkerSchema(BaseModel):
    """Schema para respuesta de Trabajadores Activos utilizado en el Dashboard"""
    id: int
    nombre: str
    numeroEmpleado: str
    area: Optional[str] = None
    ritmoCardiaco: Optional[float] = None
    temperaturaCorporal: Optional[float] = None
    nivelBateria: Optional[float] = None
    tiempoActivo: int  # segundos desde que el dispositivo está online
    cascoId: int

    class Config:
        from_attributes = True


class AlertCountsLastMonthSchema(BaseModel):
    """Schema para respuesta de 'Alertas por Tipo - Último Mes'"""
    labels: list[str]
    gasesToxicos: int
    ritmoCardiacoAnormal: int
    temperaturaCorporalAlta: int
    caidasImpactos: int


class AlertsByTypeWeeklySchema(BaseModel):
    """Schema para gráfica de alertas por tipo agrupadas por semana"""
    labels: list[str] = Field(..., description="Labels de las semanas")
    gasesToxicos: list[int] = Field(..., description="Datos semanales de gases tóxicos")
    ritmoCardiacoAnormal: list[int] = Field(..., description="Datos semanales de ritmo cardíaco anormal")
    temperaturaCorporalAlta: list[int] = Field(..., description="Datos semanales de temperatura alta")
    caidasImpactos: list[int] = Field(..., description="Datos semanales de caídas e impactos")


class BiometricsByAreaSchema(BaseModel):
    """Schema para 'Promedios Biométricos por Área'"""
    areas: list[str]
    ritmoCardiaco: list[float]
    temperaturaCorporal: list[float]


class SupervisorAreaBiometricsSchema(BaseModel):
    """Schema para promedios biométricos del área del supervisor"""
    area: str
    ritmoCardiaco: float
    temperaturaCorporal: float
    workerCount: int


class SupervisorIncidentItemSchema(BaseModel):
    """Item de incidente para la vista del supervisor"""
    id: int
    description: str
    severity: str
    user_full_name: str
    user_employee_number: str
    area: Optional[str] = None
    created_at: datetime
    reading_timestamp: Optional[datetime] = None


class RecentAlertItemSchema(BaseModel):
    """Item para 'Alertas Recientes'"""
    id: int
    tipo: str
    mensaje: str
    trabajador: str
    area: Optional[str] = None
    severidad: str
    timestamp: datetime
    estado: Optional[str] = None
    valor: Optional[float] = None
    user_id: int
    device_id: int
    reading_id: int


class CreateIncidentFromAlertSchema(BaseModel):
    """Schema para crear un incidente desde una alerta"""
    description: str = Field(..., min_length=10, max_length=255, description="Descripción del incidente")
    severity: Literal['low', 'medium', 'high', 'critical'] = Field(..., description="Severidad del incidente")
    user_id: int = Field(..., description="ID del usuario afectado")
    device_id: int = Field(..., description="ID del dispositivo")
    reading_id: int = Field(..., description="ID de la lectura que generó la alerta")
    alert_id: Optional[int] = Field(None, description="ID de la alerta relacionada (opcional)")


class IncidentCreatedResponseSchema(BaseModel):
    """Respuesta al crear un incidente"""
    id: int
    message: str = "Incidente creado exitosamente"
    created_at: datetime


class CriticalAlertsStatsSchema(BaseModel):
    """Estadísticas de alertas críticas para el dashboard"""
    critical_count: int = Field(..., description="Número de alertas críticas actuales")
    total_last_24h: int = Field(..., description="Total de alertas en las últimas 24 horas")


class DeviceStatsSchema(BaseModel):
    """Estadísticas de dispositivos para el dashboard"""
    active_devices: int = Field(..., description="Número de dispositivos actualmente activos")
    total_devices: int = Field(..., description="Total de dispositivos en el sistema")
    connection_rate: float = Field(..., description="Porcentaje de conexión")


class RiskLevelSchema(BaseModel):
    """Nivel de riesgo calculado para el dashboard"""
    risk_level: str = Field(..., description="Nivel de riesgo: low, medium, high, critical")
    critical_alerts_count: int = Field(..., description="Número de alertas críticas/high en últimas 24h")
    affected_areas_count: int = Field(..., description="Número de áreas afectadas")
    recommendation: str = Field(..., description="Recomendación para el manager")

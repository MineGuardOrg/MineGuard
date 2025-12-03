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

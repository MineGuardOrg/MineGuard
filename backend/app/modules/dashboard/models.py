# Modelos del módulo Dashboard (Esquemas Pydantic)
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ActiveWorkerSchema(BaseModel):
    """Schema para respuesta de Trabajadores Activos utilizado en el Dashboard"""
    id: int
    nombre: str
    area: Optional[str] = None
    ritmoCardiaco: Optional[float] = None
    temperaturaCorpral: Optional[float] = None
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


class RecentAlertItemSchema(BaseModel):
    """Item para 'Alertas Recientes'"""
    id: int
    tipo: str
    trabajador: str
    area: Optional[str] = None
    severidad: str
    timestamp: datetime
    estado: Optional[str] = None
    valor: float

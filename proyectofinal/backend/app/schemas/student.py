from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class StudentBase(BaseModel):
    nombre: str
    edad: Optional[int] = None
    genero: Optional[str] = None
    promedio_anterior: Optional[float] = None
    asistencia: Optional[float] = Field(None, ge=0, le=100)
    horas_estudio: Optional[float] = Field(None, ge=0)
    participacion: Optional[float] = Field(None, ge=0, le=100)

class StudentCreate(StudentBase):
    pass

class StudentUpdate(StudentBase):
    nombre: Optional[str] = None
    calificacion_actual: Optional[float] = None
    reprobo: Optional[int] = Field(None, ge=0, le=1)

class StudentResponse(StudentBase):
    id: int
    calificacion_actual: Optional[float] = None
    reprobo: Optional[int] = None
    prediccion_reprobacion: Optional[float] = None
    calificacion_estimada: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PredictionRequest(BaseModel):
    student_id: int

class PredictionResponse(BaseModel):
    student_id: int
    nombre: str
    prediccion_reprobacion: float
    calificacion_estimada: float
    estado: str  # "En riesgo" o "Sin riesgo"

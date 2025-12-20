from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date

class EvaluacionBase(BaseModel):
    no_curso: Optional[int] = None
    curso: Optional[str] = None
    nombre_oficial: Optional[str] = None
    clave_oficial: Optional[str] = None
    docente: Optional[str] = None
    matricula: str
    alumno: str
    calificacion: float = Field(..., ge=0, le=10)
    edo_eval: Optional[str] = None
    edo_al: Optional[str] = None
    tipo_eval: Optional[str] = None
    estado_evaluacion: Optional[str] = None
    tipo_evaluacion: Optional[str] = None
    fecha_registro: Optional[str] = None
    f_carga_aca: Optional[str] = None
    tipo_entrega: Optional[str] = None
    registro_acta: Optional[str] = None
    grupo: Optional[str] = None
    turno: Optional[str] = None
    modalidad: Optional[str] = None
    periodo: Optional[str] = None
    periodo_actual: Optional[str] = None
    numero_periodo: Optional[int] = None
    programa: Optional[str] = None
    plan_estudio_periodo: Optional[str] = None
    creditos: Optional[int] = None
    etapa_formativa: Optional[str] = None
    tipo_asignatura: Optional[str] = None
    orden: Optional[int] = None
    estado_alumno: Optional[str] = None
    campus: Optional[str] = None
    bloque: Optional[str] = None

class EvaluacionCreate(EvaluacionBase):
    pass

class EvaluacionResponse(EvaluacionBase):
    id: int
    reprobo: Optional[int] = None
    riesgo_academico: Optional[str] = None
    prediccion_reprobacion: Optional[float] = None
    calificacion_estimada: Optional[float] = None
    fecha_carga: Optional[date] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PrediccionEvaluacionRequest(BaseModel):
    evaluacion_id: Optional[int] = None
    matricula: Optional[str] = None
    # Permitir predecir por ID o matrícula

class PrediccionEvaluacionResponse(BaseModel):
    evaluacion_id: int
    matricula: str
    alumno: str
    calificacion_actual: float
    prediccion_reprobacion: float
    calificacion_estimada: float
    riesgo_academico: str  # BAJO, MEDIO, ALTO
    estado_evaluacion: str

class EstadisticasResponse(BaseModel):
    total_evaluaciones: int
    total_estudiantes_unicos: int
    estudiantes_en_riesgo: int
    promedio_calificaciones: float
    tasa_reprobacion: float
    distribucion_por_campus: list
    distribucion_por_programa: list
    distribucion_por_turno: list
    distribucion_por_modalidad: list
    top_cursos_reprobados: list

class AnalisisDocenteResponse(BaseModel):
    docente: str
    total_evaluaciones: int
    promedio_calificaciones: float
    tasa_aprobacion: float
    cursos_impartidos: list

class AnalisisCursoResponse(BaseModel):
    curso: str
    total_evaluaciones: int
    promedio_calificaciones: float
    tasa_aprobacion: float
    docentes: list

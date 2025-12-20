from sqlalchemy import Column, Integer, String, Float, DateTime, Date
from app.database import Base
from datetime import datetime

class Evaluacion(Base):
    __tablename__ = "evaluaciones"

    id = Column(Integer, primary_key=True, index=True)
    
    # Información del curso
    no_curso = Column(Integer, index=True)
    curso = Column(String(200), index=True)
    nombre_oficial = Column(String(200))
    clave_oficial = Column(String(50))
    
    # Información del docente
    docente = Column(String(200), index=True)
    
    # Información del alumno
    matricula = Column(String(50), index=True)  # Removido unique para permitir múltiples evaluaciones
    alumno = Column(String(200), index=True)
    
    # Calificaciones y evaluación
    calificacion = Column(Float, index=True)
    edo_eval = Column(String(10))  # NA, A
    edo_al = Column(String(10))  # AC, RE, EG
    tipo_eval = Column(String(10))  # ORD, EXT
    estado_evaluacion = Column(String(50), index=True)  # ACREDITADA, NO ACREDITADA
    tipo_evaluacion = Column(String(50))  # ORDINARIA
    
    # Fechas
    fecha_registro = Column(String(50))
    f_carga_aca = Column(String(50))
    
    # Información académica
    tipo_entrega = Column(String(50))
    registro_acta = Column(String(200))
    grupo = Column(String(50), index=True)
    turno = Column(String(50), index=True)  # Matutino, Vespertino
    modalidad = Column(String(50), index=True)  # PRESENCIAL, VIRTUAL, SEMIPRESENCIAL
    
    # Periodo y programa
    periodo = Column(String(50), index=True)
    periodo_actual = Column(String(50))
    numero_periodo = Column(Integer)
    programa = Column(String(200), index=True)
    plan_estudio_periodo = Column(String(50))
    
    # Detalles del curso
    creditos = Column(Integer)
    etapa_formativa = Column(String(50), index=True)  # BÁSICA, PROFESIONAL, TERMINAL
    tipo_asignatura = Column(String(50), index=True)  # OBLIGATORIA, OPTATIVA
    orden = Column(Integer)
    
    # Estado del alumno
    estado_alumno = Column(String(50), index=True)  # REGULAR, IRREGULAR, EGRESADO
    
    # Campus
    campus = Column(String(100), index=True)
    bloque = Column(String(50))
    
    # Variables derivadas para ML
    reprobo = Column(Integer, nullable=True)  # 0 o 1 (derivado de calificacion < 7)
    riesgo_academico = Column(String(20), nullable=True)  # BAJO, MEDIO, ALTO
    prediccion_reprobacion = Column(Float, nullable=True)
    calificacion_estimada = Column(Float, nullable=True)
    
    # Control de carga de datos
    fecha_carga = Column(Date, index=True, default=datetime.utcnow().date)  # Fecha del día que se subió el dataset
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

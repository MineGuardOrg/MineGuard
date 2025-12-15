from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database import Base
from datetime import datetime

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    edad = Column(Integer)
    genero = Column(String(20))
    promedio_anterior = Column(Float)
    asistencia = Column(Float)  # Porcentaje
    horas_estudio = Column(Float)
    participacion = Column(Float)
    calificacion_actual = Column(Float, nullable=True)
    reprobo = Column(Integer, nullable=True)  # 0 o 1
    prediccion_reprobacion = Column(Float, nullable=True)  # Probabilidad
    calificacion_estimada = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

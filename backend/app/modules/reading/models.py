# Modelos del módulo Reading
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, BigInteger, Float, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class Reading(Base):
    __tablename__ = "reading"

    id = Column(BigInteger, primary_key=True, autoincrement=True, unique=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    device_id = Column(Integer, ForeignKey("device.id"), nullable=False)

    # Sensores del casco
    mq7 = Column(Float, nullable=True, comment="Nivel de CO en ppm")
    pulse = Column(Integer, nullable=True, comment="Ritmo cardíaco en bpm")
    body_temp = Column(Float, nullable=True, comment="Temperatura corporal (MAX30205)")

    # Acelerómetro
    ax = Column(Float, nullable=True, comment="Acelerómetro eje X")
    ay = Column(Float, nullable=True, comment="Acelerómetro eje Y")
    az = Column(Float, nullable=True, comment="Acelerómetro eje Z")

    # Giroscopio
    gx = Column(Float, nullable=True, comment="Giroscopio eje X")
    gy = Column(Float, nullable=True, comment="Giroscopio eje Y")
    gz = Column(Float, nullable=True, comment="Giroscopio eje Z")

    timestamp = Column(TIMESTAMP, nullable=False, server_default=func.now())


class ReadingCreateSchema(BaseModel):
    user_id: int = Field(..., description="ID del usuario/minero")
    device_id: int = Field(..., description="ID del dispositivo/casco")
    mq7: Optional[float] = Field(None, description="Nivel de CO en ppm")
    pulse: Optional[int] = Field(None, description="Ritmo cardíaco en bpm")
    body_temp: Optional[float] = Field(None, description="Temperatura corporal (MAX30205)")
    ax: Optional[float] = Field(None, description="Acelerómetro eje X")
    ay: Optional[float] = Field(None, description="Acelerómetro eje Y")
    az: Optional[float] = Field(None, description="Acelerómetro eje Z")
    gx: Optional[float] = Field(None, description="Giroscopio eje X")
    gy: Optional[float] = Field(None, description="Giroscopio eje Y")
    gz: Optional[float] = Field(None, description="Giroscopio eje Z")


class ReadingUpdateSchema(BaseModel):
    mq7: Optional[float] = None
    pulse: Optional[int] = None
    body_temp: Optional[float] = None
    ax: Optional[float] = None
    ay: Optional[float] = None
    az: Optional[float] = None
    gx: Optional[float] = None
    gy: Optional[float] = None
    gz: Optional[float] = None


class ReadingSchema(BaseModel):
    id: int
    user_id: int
    device_id: int
    mq7: Optional[float] = None
    pulse: Optional[int] = None
    body_temp: Optional[float] = None
    ax: Optional[float] = None
    ay: Optional[float] = None
    az: Optional[float] = None
    gx: Optional[float] = None
    gy: Optional[float] = None
    gz: Optional[float] = None
    timestamp: datetime

    class Config:
        from_attributes = True

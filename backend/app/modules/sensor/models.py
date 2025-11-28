# Modelos del módulo Sensor
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey, Float, Enum
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class SensorTypeEnum(str, enum.Enum):
    MQ7 = "mq7"
    PULSE = "pulse"
    ACCELEROMETER = "accelerometer"
    GYROSCOPE = "gyroscope"


class Sensor(Base):
    __tablename__ = "sensor"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    device_id = Column(Integer, ForeignKey("device.id"), nullable=False)
    sensor_type = Column(Enum(SensorTypeEnum, values_callable=lambda x: [e.value for e in x]), nullable=False)
    name = Column(String(100), nullable=False)
    unit = Column(String(20), nullable=False)
    min_threshold = Column(Float, nullable=True)
    max_threshold = Column(Float, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP, nullable=True, onupdate=func.now())


class SensorCreateSchema(BaseModel):
    device_id: int = Field(..., description="ID del dispositivo")
    sensor_type: SensorTypeEnum = Field(..., description="Tipo de sensor (mq7, pulse, accelerometer, gyroscope)")
    name: str = Field(..., description="Nombre del sensor")
    unit: str = Field(..., description="Unidad de medida (ppm, bpm, m/s², rad/s)")
    min_threshold: Optional[float] = Field(None, description="Umbral mínimo aceptable")
    max_threshold: Optional[float] = Field(None, description="Umbral máximo aceptable")


class SensorUpdateSchema(BaseModel):
    device_id: Optional[int] = None
    sensor_type: Optional[SensorTypeEnum] = None
    name: Optional[str] = None
    unit: Optional[str] = None
    min_threshold: Optional[float] = None
    max_threshold: Optional[float] = None
    is_active: Optional[bool] = None


class SensorSchema(BaseModel):
    id: int
    device_id: int
    sensor_type: SensorTypeEnum
    name: str
    unit: str
    min_threshold: Optional[float] = None
    max_threshold: Optional[float] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

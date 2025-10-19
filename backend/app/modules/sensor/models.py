# Modelos del módulo Sensor
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class Sensor(Base):
    __tablename__ = "sensor"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    unit = Column(String(20), nullable=False)
    type = Column(String(50), nullable=False)
    device_id = Column(Integer, ForeignKey("device.id"), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP, nullable=True, onupdate=func.now())


class SensorCreateSchema(BaseModel):
    name: str
    description: str
    unit: str
    type: str
    device_id: int


class SensorUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    unit: Optional[str] = None
    type: Optional[str] = None
    device_id: Optional[int] = None
    is_active: Optional[bool] = None


class SensorSchema(BaseModel):
    id: int
    name: str
    description: str
    unit: str
    type: str
    device_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Modelos del módulo Device (Entidades + Esquemas)
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class Device(Base):
    """Entidad Device ORM para SQLAlchemy"""
    __tablename__ = "device"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    model = Column(String(100), nullable=False)
    battery = Column(Integer, nullable=True, comment="Nivel de batería en porcentaje")
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    assigned_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP, nullable=True, onupdate=func.now())


class DeviceCreateSchema(BaseModel):
    model: str
    user_id: int


class DeviceUpdateSchema(BaseModel):
    model: Optional[str] = None
    user_id: Optional[int] = None
    is_active: Optional[bool] = None


class DeviceSchema(BaseModel):
    id: int
    model: str
    battery: Optional[int] = None
    user_id: int
    is_active: bool
    assigned_at: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

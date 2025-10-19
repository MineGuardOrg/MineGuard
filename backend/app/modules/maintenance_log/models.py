# Modelos del módulo Maintenance Log
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class MaintenanceLog(Base):
    __tablename__ = "maintenance_log"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    description = Column(String(255), nullable=False)
    device_id = Column(Integer, ForeignKey("device.id"), nullable=False)
    performed_by = Column(Integer, ForeignKey("user.id"), nullable=False)
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP, nullable=True, onupdate=func.now())


class MaintenanceLogCreateSchema(BaseModel):
    description: str
    device_id: int
    performed_by: int


class MaintenanceLogUpdateSchema(BaseModel):
    description: Optional[str] = None
    device_id: Optional[int] = None
    performed_by: Optional[int] = None


class MaintenanceLogSchema(BaseModel):
    id: int
    description: str
    device_id: int
    performed_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

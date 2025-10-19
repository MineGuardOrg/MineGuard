# Modelos del módulo Area (Entidades + Esquemas)
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

# ==================== ENTIDAD AREA (SQLAlchemy Model) ====================

class Area(Base):
    """Entidad Area ORM para SQLAlchemy"""
    __tablename__ = "area"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP, nullable=True, onupdate=func.now())

# ==================== ESQUEMAS (Pydantic Models) ====================

class AreaCreateSchema(BaseModel):
    """Schema para crear área"""
    name: str
    description: Optional[str] = None

class AreaUpdateSchema(BaseModel):
    """Schema para actualizar área"""
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class AreaSchema(BaseModel):
    """Schema para respuesta de área"""
    id: int
    name: str
    description: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
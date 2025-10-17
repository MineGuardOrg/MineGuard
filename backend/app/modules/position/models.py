# Modelos del módulo Position (Entidades + Esquemas)
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

# ==================== ENTIDAD POSITION (SQLAlchemy Model) ====================

class Position(Base):
    """Entidad Position ORM para SQLAlchemy"""
    __tablename__ = "position"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    description = Column(String(255), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP, nullable=True, onupdate=func.now())

# ==================== ESQUEMAS (Pydantic Models) ====================

class PositionCreateSchema(BaseModel):
    """Schema para crear posición"""
    name: str
    description: Optional[str] = None

class PositionUpdateSchema(BaseModel):
    """Schema para actualizar posición"""
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class PositionSchema(BaseModel):
    """Schema para respuesta de posición"""
    id: int
    name: str
    description: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
        from_attributes = True
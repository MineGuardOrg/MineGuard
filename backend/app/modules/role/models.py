# Modelos del módulo Role (Entidades + Esquemas)
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

# ==================== ENTIDAD ROLE (SQLAlchemy Model) ====================

class Role(Base):
    """Entidad Role ORM para SQLAlchemy"""
    __tablename__ = "role"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    name = Column(String(15), nullable=False)
    description = Column(String(255), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP, nullable=True, onupdate=func.now())

# ==================== ESQUEMAS (Pydantic Models) ====================

class RoleCreateSchema(BaseModel):
    """Schema para crear rol"""
    name: str
    description: str

class RoleUpdateSchema(BaseModel):
    """Schema para actualizar rol"""
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class RoleSchema(BaseModel):
    """Schema para respuesta de rol"""
    id: int
    name: str
    description: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
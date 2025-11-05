# Modelos del módulo Auth (Entidades + Esquemas)
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

# Importar entidades de otros módulos para resolver FK
from app.modules.role.models import Role
from app.modules.area.models import Area  
from app.modules.position.models import Position

# ==================== ENTIDAD USER (SQLAlchemy Model) ====================

class User(Base):
    """Entidad Usuario ORM para SQLAlchemy"""
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    employee_number = Column(String(20), nullable=False, unique=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    role_id = Column(Integer, ForeignKey("role.id"), nullable=False)
    area_id = Column(Integer, ForeignKey("area.id"), nullable=True)
    position_id = Column(Integer, ForeignKey("position.id"), nullable=True)
    supervisor_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP, nullable=True, onupdate=func.now())

    # Relaciones (opcional - solo si necesitas usar las relaciones)
    role = relationship("Role", backref="users")
    # area = relationship("Area", backref="users")
    # position = relationship("Position", backref="users")
    # supervisor = relationship("User", remote_side=[id], backref="subordinates")

# ==================== ESQUEMAS (Pydantic Models) ====================

class LoginSchema(BaseModel):
    """Schema para autenticación - Login"""
    employee_number: str
    password: str

class TokenResponse(BaseModel):
    """Schema para respuesta de token JWT"""
    access_token: str
    token_type: str
    role: str

class UserCreateSchema(BaseModel):
    """Schema para crear usuario (uso interno)"""
    employee_number: str
    first_name: str
    last_name: str
    email: str
    password: str
    role_id: int
    area_id: Optional[int] = None
    position_id: Optional[int] = None
    supervisor_id: Optional[int] = None

class UserRegisterSchema(BaseModel):
    """Schema para registro público - solo campos básicos"""
    employee_number: str
    first_name: str
    last_name: str
    email: str
    password: str
    role_id: Optional[int] = None  # Opcional, por defecto será User (id=2)

class UserSchema(BaseModel):
    """Schema para respuesta de usuario (sin password)"""
    id: int
    employee_number: str
    first_name: str
    last_name: str
    email: str
    role_id: int
    area_id: Optional[int] = None
    position_id: Optional[int] = None
    supervisor_id: Optional[int] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserUpdateSchema(BaseModel):
    """Schema para actualizar usuario"""
    employee_number: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role_id: Optional[int] = None
    area_id: Optional[int] = None
    position_id: Optional[int] = None
    supervisor_id: Optional[int] = None
    is_active: Optional[bool] = None
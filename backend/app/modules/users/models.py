# Modelos del módulo Users (Entidades + Esquemas)
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Importar la entidad User existente (reutilizamos la del módulo auth)
from app.modules.auth.models import User

# ==================== ESQUEMAS (Pydantic Models) ====================

class UserCreateSchema(BaseModel):
    """Schema para crear usuario completo (uso interno)"""
    employee_number: str
    first_name: str
    last_name: str
    email: str
    password: str
    role_id: int
    area_id: Optional[int] = None
    position_id: Optional[int] = None
    supervisor_id: Optional[int] = None

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


class UserDetailSchema(BaseModel):
    """Schema para respuesta de usuario con detalles (nombres de área y posición)"""
    id: int
    employee_number: str
    first_name: str
    last_name: str
    email: str
    role_id: int
    area_id: Optional[int] = None
    area_name: Optional[str] = None
    position_id: Optional[int] = None
    position_name: Optional[str] = None
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

class UserListSchema(BaseModel):
    """Schema simplificado para listas de usuarios"""
    id: int
    employee_number: str
    first_name: str
    last_name: str
    email: str
    role_id: int
    is_active: bool

    class Config:
        from_attributes = True
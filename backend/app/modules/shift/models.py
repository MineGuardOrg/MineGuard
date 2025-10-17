# Modelos del módulo Shift
from pydantic import BaseModel
from datetime import datetime, time
from typing import Optional
from sqlalchemy import Column, Integer, Time, Boolean, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base


class Shift(Base):
    __tablename__ = "shift"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP, nullable=True, onupdate=func.now())


class ShiftCreateSchema(BaseModel):
    start_time: time
    end_time: time


class ShiftUpdateSchema(BaseModel):
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    is_active: Optional[bool] = None


class ShiftSchema(BaseModel):
    id: int
    start_time: time
    end_time: time
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
        from_attributes = True

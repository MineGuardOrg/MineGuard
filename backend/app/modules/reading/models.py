# Modelos del módulo Reading
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, BigInteger, Float, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class Reading(Base):
    __tablename__ = "reading"

    id = Column(BigInteger, primary_key=True, autoincrement=True, unique=True)
    value = Column(Float, nullable=False)
    sensor_id = Column(Integer, ForeignKey("sensor.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    timestamp = Column(TIMESTAMP, nullable=False, server_default=func.now())


class ReadingCreateSchema(BaseModel):
    value: float
    sensor_id: int
    user_id: int


class ReadingUpdateSchema(BaseModel):
    value: Optional[float] = None
    sensor_id: Optional[int] = None
    user_id: Optional[int] = None


class ReadingSchema(BaseModel):
    id: int
    value: float
    sensor_id: int
    user_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# Modelos del módulo Connection
from pydantic import BaseModel
from datetime import datetime
from typing import Literal
from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class Connection(Base):
    __tablename__ = "connection"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    device_id = Column(Integer, ForeignKey("device.id"), nullable=False)
    status = Column(String(10), nullable=False, default='offline')  # online|offline
    timestamp = Column(TIMESTAMP, nullable=False, server_default=func.now())


class ConnectionCreateSchema(BaseModel):
    device_id: int
    status: Literal['online', 'offline']


class ConnectionUpdateSchema(BaseModel):
    device_id: int
    status: Literal['online', 'offline']


class ConnectionSchema(BaseModel):
    id: int
    device_id: int
    status: str
    timestamp: datetime

    class Config:
        orm_mode = True
        from_attributes = True

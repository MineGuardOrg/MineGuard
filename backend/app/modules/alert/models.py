# Modelos del módulo Alert
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Literal
from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, BigInteger
from sqlalchemy.sql import func
from app.core.database import Base


class Alert(Base):
    __tablename__ = "alert"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    alert_type = Column(String(50), nullable=False)
    severity = Column(String(10), nullable=False)  # low|medium|high
    reading_id = Column(BigInteger, ForeignKey("reading.id"), nullable=False)
    timestamp = Column(TIMESTAMP, nullable=False, server_default=func.now())


class AlertCreateSchema(BaseModel):
    alert_type: str
    severity: Literal['low', 'medium', 'high']
    reading_id: int


class AlertUpdateSchema(BaseModel):
    alert_type: Optional[str] = None
    severity: Optional[Literal['low', 'medium', 'high']] = None
    reading_id: Optional[int] = None


class AlertSchema(BaseModel):
    id: int
    alert_type: str
    severity: str
    reading_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

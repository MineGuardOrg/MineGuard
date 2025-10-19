# Modelos del módulo Incident Report
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Literal
from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, BigInteger
from sqlalchemy.sql import func
from app.core.database import Base


class IncidentReport(Base):
    __tablename__ = "incident_report"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    description = Column(String(255), nullable=False)
    severity = Column(String(10), nullable=False)  # low|medium|high|critical
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    device_id = Column(Integer, ForeignKey("device.id"), nullable=False)
    reading_id = Column(BigInteger, ForeignKey("reading.id"), nullable=False)
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP, nullable=True, onupdate=func.now())


class IncidentReportCreateSchema(BaseModel):
    description: str
    severity: Literal['low', 'medium', 'high', 'critical']
    user_id: int
    device_id: int
    reading_id: int


class IncidentReportUpdateSchema(BaseModel):
    description: Optional[str] = None
    severity: Optional[Literal['low', 'medium', 'high', 'critical']] = None
    user_id: Optional[int] = None
    device_id: Optional[int] = None
    reading_id: Optional[int] = None


class IncidentReportSchema(BaseModel):
    id: int
    description: str
    severity: str
    user_id: int
    device_id: int
    reading_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

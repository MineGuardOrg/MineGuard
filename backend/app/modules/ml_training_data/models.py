# Modelos del módulo ML Training Data
from pydantic import BaseModel
from datetime import datetime
from typing import Literal
from sqlalchemy import Column, BigInteger, String, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class MLTrainingData(Base):
    __tablename__ = "ml_training_data"

    id = Column(BigInteger, primary_key=True, autoincrement=True, unique=True)
    reading_id = Column(BigInteger, ForeignKey("reading.id"), nullable=False)
    label = Column(String(20), nullable=False)  # normal|danger|fatigue|toxic gas
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())


class MLTrainingDataCreateSchema(BaseModel):
    reading_id: int
    label: Literal['normal', 'danger', 'fatigue', 'toxic gas']


class MLTrainingDataUpdateSchema(BaseModel):
    reading_id: int
    label: Literal['normal', 'danger', 'fatigue', 'toxic gas']


class MLTrainingDataSchema(BaseModel):
    id: int
    reading_id: int
    label: str
    created_at: datetime

    class Config:
        from_attributes = True

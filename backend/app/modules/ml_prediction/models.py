# Modelos del módulo ML Prediction
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy import Column, BigInteger, String, Float, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class MLPrediction(Base):
    __tablename__ = "ml_prediction"

    id = Column(BigInteger, primary_key=True, autoincrement=True, unique=True)
    reading_id = Column(BigInteger, ForeignKey("reading.id"), nullable=False)
    prediction = Column(String(50), nullable=False)
    probability = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())


class MLPredictionCreateSchema(BaseModel):
    reading_id: int
    prediction: str
    probability: float


class MLPredictionUpdateSchema(BaseModel):
    reading_id: int
    prediction: str
    probability: float


class MLPredictionSchema(BaseModel):
    id: int
    reading_id: int
    prediction: str
    probability: float
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

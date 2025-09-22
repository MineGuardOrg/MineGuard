# Entidad MLPrediction ORM para SQLAlchemy
from sqlalchemy import Column, BigInteger, String, Float, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base

class MLPrediction(Base):
    __tablename__ = "ml_prediction"

    id = Column(BigInteger, primary_key=True, autoincrement=True, unique=True)
    reading_id = Column(BigInteger, ForeignKey("reading.id"), nullable=False)
    prediction = Column(String(50), nullable=False)
    probability = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)

    reading = relationship("Reading", backref="ml_predictions")

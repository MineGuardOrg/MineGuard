# Entidad MLTrainingData ORM para SQLAlchemy
from sqlalchemy import Column, BigInteger, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base

class MLTrainingData(Base):
    __tablename__ = "ml_training_data"

    id = Column(BigInteger, primary_key=True, autoincrement=True, unique=True)
    reading_id = Column(BigInteger, ForeignKey("reading.id"), nullable=False)
    label = Column(Enum("normal", "danger", "fatigue", "toxic gas"), nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)

    reading = relationship("Reading", backref="ml_training_data")

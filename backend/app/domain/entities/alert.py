# Entidad Alert ORM para SQLAlchemy
from sqlalchemy import Column, Integer, String, Enum, BigInteger, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base

class Alert(Base):
    __tablename__ = "alert"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    alert_type = Column(String(50), nullable=False)
    severity = Column(Enum("low", "medium", "high"), nullable=False)
    reading_id = Column(BigInteger, ForeignKey("reading.id"), nullable=False)
    timestamp = Column(TIMESTAMP, nullable=False)

    reading = relationship("Reading", backref="alerts")

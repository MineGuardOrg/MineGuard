# Entidad IncidentReport ORM para SQLAlchemy
from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base

class IncidentReport(Base):
    __tablename__ = "incident_report"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    description = Column(String(255), nullable=False)
    severity = Column(Enum("low", "medium", "high", "critical"), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    device_id = Column(Integer, ForeignKey("device.id"), nullable=False)
    reading_id = Column(BigInteger, ForeignKey("reading.id"), nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)

    user = relationship("User", backref="incident_reports")
    device = relationship("Device", backref="incident_reports")
    reading = relationship("Reading", backref="incident_reports")

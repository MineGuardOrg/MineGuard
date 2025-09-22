# Entidad Sensor ORM para SQLAlchemy
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base

class Sensor(Base):
    __tablename__ = "sensor"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    unit = Column(String(20), nullable=False)
    type = Column(String(50), nullable=False)
    device_id = Column(Integer, ForeignKey("device.id"), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)

    device = relationship("Device", backref="sensors")

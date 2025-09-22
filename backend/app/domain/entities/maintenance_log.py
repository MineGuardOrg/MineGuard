# Entidad MaintenanceLog ORM para SQLAlchemy
from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base

class MaintenanceLog(Base):
    __tablename__ = "maintenance_log"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    description = Column(String(255), nullable=False)
    device_id = Column(Integer, ForeignKey("device.id"), nullable=False)
    performed_by = Column(Integer, ForeignKey("user.id"), nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)

    device = relationship("Device", backref="maintenance_logs")
    user = relationship("User", backref="maintenance_logs")

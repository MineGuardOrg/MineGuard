# Entidad Connection ORM para SQLAlchemy
from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base

class Connection(Base):
    __tablename__ = "connection"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    device_id = Column(Integer, ForeignKey("device.id"), nullable=False)
    status = Column(Enum("online", "offline"), nullable=False, default="offline")
    timestamp = Column(TIMESTAMP, nullable=False)

    device = relationship("Device", backref="connections")

# Entidad Device ORM para SQLAlchemy
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base

class Device(Base):
    __tablename__ = "device"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    model = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    assigned_at = Column(TIMESTAMP, nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)

    user = relationship("User", backref="devices")

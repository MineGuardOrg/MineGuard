# Entidad Area ORM para SQLAlchemy
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP
from app.infrastructure.database import Base

class Area(Base):
    __tablename__ = "area"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)

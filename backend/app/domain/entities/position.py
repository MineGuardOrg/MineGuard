# Entidad Position ORM para SQLAlchemy
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP
from app.infrastructure.database import Base

class Position(Base):
    __tablename__ = "position"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    description = Column(String(255), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)

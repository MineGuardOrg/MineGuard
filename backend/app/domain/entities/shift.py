# Entidad Shift ORM para SQLAlchemy
from sqlalchemy import Column, Integer, Boolean, TIMESTAMP, Time
from app.infrastructure.database import Base

class Shift(Base):
    __tablename__ = "shift"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False)

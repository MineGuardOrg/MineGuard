# Entidad Usuario ORM para SQLAlchemy
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base
from app.domain.entities.role import Role
from app.domain.entities.area import Area
from app.domain.entities.position import Position

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    employee_number = Column(String(20), nullable=False, unique=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    role_id = Column(Integer, ForeignKey("role.id"), nullable=False)
    area_id = Column(Integer, ForeignKey("area.id"), nullable=True)
    position_id = Column(Integer, ForeignKey("position.id"), nullable=True)
    supervisor_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP, nullable=True, onupdate=func.now())

    # Relaciones
    role = relationship("Role", backref="users")
    area = relationship("Area", backref="users")
    position = relationship("Position", backref="users")
    supervisor = relationship("User", remote_side=[id], backref="subordinates")

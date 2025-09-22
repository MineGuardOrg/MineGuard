# Entidad UserShift ORM para SQLAlchemy
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base

class UserShift(Base):
    __tablename__ = "user_shift"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    shift_id = Column(Integer, ForeignKey("shift.id"), nullable=False)

    user = relationship("User", backref="user_shifts")
    shift = relationship("Shift", backref="user_shifts")

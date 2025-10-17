# Modelos del módulo User Shift
from pydantic import BaseModel
from sqlalchemy import Column, Integer, ForeignKey
from app.core.database import Base


class UserShift(Base):
    __tablename__ = "user_shift"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    shift_id = Column(Integer, ForeignKey("shift.id"), nullable=False)


class UserShiftCreateSchema(BaseModel):
    user_id: int
    shift_id: int


class UserShiftUpdateSchema(BaseModel):
    user_id: int
    shift_id: int


class UserShiftSchema(BaseModel):
    id: int
    user_id: int
    shift_id: int

    class Config:
        orm_mode = True
        from_attributes = True

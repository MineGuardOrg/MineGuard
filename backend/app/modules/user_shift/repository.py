# Repositorio del módulo User Shift
from typing import List
from app.shared.base_repository import BaseRepository
from app.modules.user_shift.models import UserShift
from app.core.database import SessionLocal


class UserShiftRepository(BaseRepository[UserShift]):
    def __init__(self):
        super().__init__(UserShift)

    def get_by_user(self, user_id: int) -> List[UserShift]:
        with SessionLocal() as db:
            return db.query(self.model).filter(self.model.user_id == user_id).all()

    def get_by_shift(self, shift_id: int) -> List[UserShift]:
        with SessionLocal() as db:
            return db.query(self.model).filter(self.model.shift_id == shift_id).all()

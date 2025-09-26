# DAO para asignación de usuarios a turnos
from app.domain.entities.user_shift import UserShift
from app.infrastructure.database import SessionLocal

class UserShiftDAO:
    @staticmethod
    def get_by_id(user_shift_id: int):
        with SessionLocal() as db:
            return db.query(UserShift).filter(UserShift.id == user_shift_id, UserShift.is_active == True).first()

    @staticmethod
    def soft_delete(user_shift_id: int):
        with SessionLocal() as db:
            user_shift = db.query(UserShift).filter(UserShift.id == user_shift_id, UserShift.is_active == True).first()
            if user_shift:
                user_shift.is_active = False
                db.commit()
            return user_shift

    @staticmethod
    def create(user_shift_data: dict):
        with SessionLocal() as db:
            user_shift = UserShift(**user_shift_data)
            db.add(user_shift)
            db.commit()
            db.refresh(user_shift)
            return user_shift

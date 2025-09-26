# DAO para turnos
from app.domain.entities.shift import Shift
from app.infrastructure.database import SessionLocal

class ShiftDAO:
    @staticmethod
    def get_by_id(shift_id: int):
        with SessionLocal() as db:
            return db.query(Shift).filter(Shift.id == shift_id, Shift.is_active == True).first()

    @staticmethod
    def soft_delete(shift_id: int):
        with SessionLocal() as db:
            shift = db.query(Shift).filter(Shift.id == shift_id, Shift.is_active == True).first()
            if shift:
                shift.is_active = False
                db.commit()
            return shift

    @staticmethod
    def create(shift_data: dict):
        with SessionLocal() as db:
            shift = Shift(**shift_data)
            db.add(shift)
            db.commit()
            db.refresh(shift)
            return shift

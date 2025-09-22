# DAO para turnos
from app.domain.entities.shift import Shift
from app.infrastructure.database import SessionLocal

class ShiftDAO:
    @staticmethod
    def get_by_id(shift_id: int):
        db = SessionLocal()
        shift = db.query(Shift).filter(Shift.id == shift_id, Shift.is_active == True).first()
        db.close()
        return shift

    @staticmethod
    def soft_delete(shift_id: int):
        db = SessionLocal()
        shift = db.query(Shift).filter(Shift.id == shift_id, Shift.is_active == True).first()
        if shift:
            shift.is_active = False
            db.commit()
        db.close()
        return shift

    @staticmethod
    def create(shift_data: dict):
        db = SessionLocal()
        shift = Shift(**shift_data)
        db.add(shift)
        db.commit()
        db.refresh(shift)
        db.close()
        return shift

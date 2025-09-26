from app.infrastructure.dao.shift_dao import ShiftDAO
from app.domain.schemas.shift_schema import ShiftSchema

class ShiftService:
    @staticmethod
    def get_all_shifts():
        shifts = ShiftDAO.get_all()
        return [ShiftSchema.from_orm(s) for s in shifts]

    @staticmethod
    def get_shift_by_id(shift_id: int):
        s = ShiftDAO.get_by_id(shift_id)
        if s:
            return ShiftSchema.from_orm(s)
        return None

    @staticmethod
    def create_shift(shift_data: dict):
        s = ShiftDAO.create(shift_data)
        return ShiftSchema.from_orm(s)

    @staticmethod
    def soft_delete_shift(shift_id: int):
        s = ShiftDAO.soft_delete(shift_id)
        return bool(s)

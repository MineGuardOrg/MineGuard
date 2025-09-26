from app.infrastructure.dao.user_shift_dao import UserShiftDAO
from app.domain.schemas.user_shift_schema import UserShiftSchema

class UserShiftService:
    @staticmethod
    def get_all_user_shifts():
        user_shifts = UserShiftDAO.get_all()
        return [UserShiftSchema.from_orm(us) for us in user_shifts]

    @staticmethod
    def get_user_shift_by_id(user_shift_id: int):
        us = UserShiftDAO.get_by_id(user_shift_id)
        if us:
            return UserShiftSchema.from_orm(us)
        return None

    @staticmethod
    def create_user_shift(user_shift_data: dict):
        us = UserShiftDAO.create(user_shift_data)
        return UserShiftSchema.from_orm(us)

    @staticmethod
    def soft_delete_user_shift(user_shift_id: int):
        us = UserShiftDAO.soft_delete(user_shift_id)
        return bool(us)

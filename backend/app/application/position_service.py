from app.infrastructure.dao.position_dao import PositionDAO
from app.domain.schemas.position_schema import PositionSchema

class PositionService:
    @staticmethod
    def get_all_positions():
        positions = PositionDAO.get_all()
        return [PositionSchema.from_orm(position) for position in positions]

    @staticmethod
    def get_position_by_id(position_id: int):
        position = PositionDAO.get_by_id(position_id)
        if position:
            return PositionSchema.from_orm(position)
        return None

    @staticmethod
    def create_position(position_data: dict):
        position = PositionDAO.create(position_data)
        return PositionSchema.from_orm(position)

    @staticmethod
    def soft_delete_position(position_id: int):
        position = PositionDAO.soft_delete(position_id)
        return bool(position)

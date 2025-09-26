from app.infrastructure.dao.area_dao import AreaDAO
from app.domain.schemas.area_schema import AreaSchema

class AreaService:
    @staticmethod
    def get_all_areas():
        areas = AreaDAO.get_all()
        return [AreaSchema.from_orm(area) for area in areas]

    @staticmethod
    def get_area_by_id(area_id: int):
        area = AreaDAO.get_by_id(area_id)
        if area:
            return AreaSchema.from_orm(area)
        return None

    @staticmethod
    def create_area(area_data: dict):
        area = AreaDAO.create(area_data)
        return AreaSchema.from_orm(area)

    @staticmethod
    def soft_delete_area(area_id: int):
        area = AreaDAO.soft_delete(area_id)
        return bool(area)

from app.infrastructure.dao.reading_dao import ReadingDAO
from app.domain.schemas.reading_schema import ReadingSchema

class ReadingService:
    @staticmethod
    def get_all_readings():
        readings = ReadingDAO.get_all()
        return [ReadingSchema.from_orm(r) for r in readings]

    @staticmethod
    def get_reading_by_id(reading_id: int):
        r = ReadingDAO.get_by_id(reading_id)
        if r:
            return ReadingSchema.from_orm(r)
        return None

    @staticmethod
    def create_reading(reading_data: dict):
        r = ReadingDAO.create(reading_data)
        return ReadingSchema.from_orm(r)

    @staticmethod
    def soft_delete_reading(reading_id: int):
        r = ReadingDAO.soft_delete(reading_id)
        return bool(r)

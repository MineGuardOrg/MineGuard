# DAO para áreas
from app.domain.entities.area import Area
from app.infrastructure.database import SessionLocal

class AreaDAO:
    @staticmethod
    def get_by_id(area_id: int):
        db = SessionLocal()
        area = db.query(Area).filter(Area.id == area_id, Area.is_active == True).first()
        db.close()
        return area
    
    @staticmethod
    def soft_delete(area_id: int):
        db = SessionLocal()
        area = db.query(Area).filter(Area.id == area_id, Area.is_active == True).first()
        if area:
            area.is_active = False
            db.commit()
        db.close()
        return area

    @staticmethod
    def create(area_data: dict):
        db = SessionLocal()
        area = Area(**area_data)
        db.add(area)
        db.commit()
        db.refresh(area)
        db.close()
        return area

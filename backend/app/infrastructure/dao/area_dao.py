# DAO para áreas
from app.domain.entities.area import Area
from app.infrastructure.database import SessionLocal

class AreaDAO:
    @staticmethod
    def get_all():
        with SessionLocal() as db:
            return db.query(Area).filter(Area.is_active == True).all()

    @staticmethod
    def get_by_id(area_id: int):
        with SessionLocal() as db:
            return db.query(Area).filter(Area.id == area_id, Area.is_active == True).first()
    
    @staticmethod
    def soft_delete(area_id: int):
        with SessionLocal() as db:
            area = db.query(Area).filter(Area.id == area_id, Area.is_active == True).first()
            if area:
                area.is_active = False
                db.commit()
            return area

    @staticmethod
    def create(area_data: dict):
        with SessionLocal() as db:
            area = Area(**area_data)
            db.add(area)
            db.commit()
            db.refresh(area)
            return area

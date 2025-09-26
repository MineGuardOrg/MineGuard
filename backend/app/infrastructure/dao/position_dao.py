# DAO para posiciones
from app.domain.entities.position import Position
from app.infrastructure.database import SessionLocal

class PositionDAO:
    @staticmethod
    def get_by_id(position_id: int):
        with SessionLocal() as db:
            return db.query(Position).filter(Position.id == position_id, Position.is_active == True).first()
    
    @staticmethod
    def soft_delete(position_id: int):
        with SessionLocal() as db:
            position = db.query(Position).filter(Position.id == position_id, Position.is_active == True).first()
            if position:
                position.is_active = False
                db.commit()
            return position

    @staticmethod
    def create(position_data: dict):
        with SessionLocal() as db:
            position = Position(**position_data)
            db.add(position)
            db.commit()
            db.refresh(position)
            return position

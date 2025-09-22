# DAO para posiciones
from app.domain.entities.position import Position
from app.infrastructure.database import SessionLocal

class PositionDAO:
    @staticmethod
    def get_by_id(position_id: int):
        db = SessionLocal()
        position = db.query(Position).filter(Position.id == position_id, Position.is_active == True).first()
        db.close()
        return position
    
    @staticmethod
    def soft_delete(position_id: int):
        db = SessionLocal()
        position = db.query(Position).filter(Position.id == position_id, Position.is_active == True).first()
        if position:
            position.is_active = False
            db.commit()
        db.close()
        return position

    @staticmethod
    def create(position_data: dict):
        db = SessionLocal()
        position = Position(**position_data)
        db.add(position)
        db.commit()
        db.refresh(position)
        db.close()
        return position

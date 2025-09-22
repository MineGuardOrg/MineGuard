# DAO para lecturas
from app.domain.entities.reading import Reading
from app.infrastructure.database import SessionLocal

class ReadingDAO:
    @staticmethod
    def get_by_id(reading_id: int):
        db = SessionLocal()
        reading = db.query(Reading).filter(Reading.id == reading_id, Reading.is_active == True).first()
        db.close()
        return reading

    @staticmethod
    def soft_delete(reading_id: int):
        db = SessionLocal()
        reading = db.query(Reading).filter(Reading.id == reading_id, Reading.is_active == True).first()
        if reading:
            reading.is_active = False
            db.commit()
        db.close()
        return reading

    @staticmethod
    def create(reading_data: dict):
        db = SessionLocal()
        reading = Reading(**reading_data)
        db.add(reading)
        db.commit()
        db.refresh(reading)
        db.close()
        return reading

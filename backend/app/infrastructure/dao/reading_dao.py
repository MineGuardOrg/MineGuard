# DAO para lecturas
from app.domain.entities.reading import Reading
from app.infrastructure.database import SessionLocal

class ReadingDAO:
    @staticmethod
    def get_by_id(reading_id: int):
        with SessionLocal() as db:
            return db.query(Reading).filter(Reading.id == reading_id, Reading.is_active == True).first()

    @staticmethod
    def soft_delete(reading_id: int):
        with SessionLocal() as db:
            reading = db.query(Reading).filter(Reading.id == reading_id, Reading.is_active == True).first()
            if reading:
                reading.is_active = False
                db.commit()
            return reading

    @staticmethod
    def create(reading_data: dict):
        with SessionLocal() as db:
            reading = Reading(**reading_data)
            db.add(reading)
            db.commit()
            db.refresh(reading)
            return reading

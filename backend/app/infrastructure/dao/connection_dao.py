# DAO para conexiones de dispositivos
from app.domain.entities.connection import Connection
from app.infrastructure.database import SessionLocal

class ConnectionDAO:
    @staticmethod
    def get_all():
        with SessionLocal() as db:
            return db.query(Connection).filter(Connection.is_active == True).all()

    @staticmethod
    def get_by_id(connection_id: int):
        with SessionLocal() as db:
            return db.query(Connection).filter(Connection.id == connection_id, Connection.is_active == True).first()

    @staticmethod
    def soft_delete(connection_id: int):
        with SessionLocal() as db:
            connection = db.query(Connection).filter(Connection.id == connection_id, Connection.is_active == True).first()
            if connection:
                connection.is_active = False
                db.commit()
            return connection

    @staticmethod
    def create(connection_data: dict):
        with SessionLocal() as db:
            connection = Connection(**connection_data)
            db.add(connection)
            db.commit()
            db.refresh(connection)
            return connection

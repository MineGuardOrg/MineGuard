# DAO para conexiones de dispositivos
from app.domain.entities.connection import Connection
from app.infrastructure.database import SessionLocal

class ConnectionDAO:
    @staticmethod
    def get_by_id(connection_id: int):
        db = SessionLocal()
        connection = db.query(Connection).filter(Connection.id == connection_id, Connection.is_active == True).first()
        db.close()
        return connection

    @staticmethod
    def soft_delete(connection_id: int):
        db = SessionLocal()
        connection = db.query(Connection).filter(Connection.id == connection_id, Connection.is_active == True).first()
        if connection:
            connection.is_active = False
            db.commit()
        db.close()
        return connection

    @staticmethod
    def create(connection_data: dict):
        db = SessionLocal()
        connection = Connection(**connection_data)
        db.add(connection)
        db.commit()
        db.refresh(connection)
        db.close()
        return connection

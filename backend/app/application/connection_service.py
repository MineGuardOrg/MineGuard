from app.infrastructure.dao.connection_dao import ConnectionDAO
from app.domain.schemas.connection_schema import ConnectionSchema

class ConnectionService:
    @staticmethod
    def get_all_connections():
        connections = ConnectionDAO.get_all()
        return [ConnectionSchema.from_orm(connection) for connection in connections]

    @staticmethod
    def get_connection_by_id(connection_id: int):
        connection = ConnectionDAO.get_by_id(connection_id)
        if connection:
            return ConnectionSchema.from_orm(connection)
        return None

    @staticmethod
    def create_connection(connection_data: dict):
        connection = ConnectionDAO.create(connection_data)
        return ConnectionSchema.from_orm(connection)

    @staticmethod
    def soft_delete_connection(connection_id: int):
        connection = ConnectionDAO.soft_delete(connection_id)
        return bool(connection)

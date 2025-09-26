from fastapi import APIRouter, HTTPException
from app.application.connection_service import ConnectionService
from app.domain.schemas.connection_schema import ConnectionSchema

connection_router = APIRouter()

@connection_router.get("/", response_model=list[ConnectionSchema])
def get_all_connections():
    return ConnectionService.get_all_connections()

@connection_router.get("/{connection_id}", response_model=ConnectionSchema)
def get_connection(connection_id: int):
    connection = ConnectionService.get_connection_by_id(connection_id)
    if not connection:
        raise HTTPException(status_code=404, detail="Conexión no encontrada")
    return connection

@connection_router.post("/", response_model=ConnectionSchema)
def create_connection(connection: ConnectionSchema):
    connection_dict = connection.dict(exclude_unset=True)
    new_connection = ConnectionService.create_connection(connection_dict)
    return new_connection

@connection_router.delete("/{connection_id}")
def delete_connection(connection_id: int):
    result = ConnectionService.soft_delete_connection(connection_id)
    if not result:
        raise HTTPException(status_code=404, detail="Conexión no encontrada o ya eliminada")
    return {"message": "Conexión eliminada (soft delete)"}

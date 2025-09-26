from fastapi import APIRouter, HTTPException
from app.application.position_service import PositionService
from app.domain.schemas.position_schema import PositionSchema

position_router = APIRouter()

@position_router.get("/", response_model=list[PositionSchema])
def get_all_positions():
    return PositionService.get_all_positions()

@position_router.get("/{position_id}", response_model=PositionSchema)
def get_position(position_id: int):
    position = PositionService.get_position_by_id(position_id)
    if not position:
        raise HTTPException(status_code=404, detail="Puesto no encontrado")
    return position

@position_router.post("/", response_model=PositionSchema)
def create_position(position: PositionSchema):
    position_dict = position.dict(exclude_unset=True)
    new_position = PositionService.create_position(position_dict)
    return new_position

@position_router.delete("/{position_id}")
def delete_position(position_id: int):
    result = PositionService.soft_delete_position(position_id)
    if not result:
        raise HTTPException(status_code=404, detail="Puesto no encontrado o ya eliminado")
    return {"message": "Puesto eliminado (soft delete)"}

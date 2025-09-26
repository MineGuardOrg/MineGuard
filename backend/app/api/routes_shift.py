from fastapi import APIRouter, HTTPException
from app.application.shift_service import ShiftService
from app.domain.schemas.shift_schema import ShiftSchema

shift_router = APIRouter()

@shift_router.get("/", response_model=list[ShiftSchema])
def get_all_shifts():
    return ShiftService.get_all_shifts()

@shift_router.get("/{shift_id}", response_model=ShiftSchema)
def get_shift(shift_id: int):
    shift = ShiftService.get_shift_by_id(shift_id)
    if not shift:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    return shift

@shift_router.post("/", response_model=ShiftSchema)
def create_shift(shift: ShiftSchema):
    shift_dict = shift.dict(exclude_unset=True)
    new_shift = ShiftService.create_shift(shift_dict)
    return new_shift

@shift_router.delete("/{shift_id}")
def delete_shift(shift_id: int):
    result = ShiftService.soft_delete_shift(shift_id)
    if not result:
        raise HTTPException(status_code=404, detail="Turno no encontrado o ya eliminado")
    return {"message": "Turno eliminado (soft delete)"}

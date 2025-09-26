from fastapi import APIRouter, HTTPException
from app.application.user_shift_service import UserShiftService
from app.domain.schemas.user_shift_schema import UserShiftSchema

user_shift_router = APIRouter()

@user_shift_router.get("/", response_model=list[UserShiftSchema])
def get_all_user_shifts():
    return UserShiftService.get_all_user_shifts()

@user_shift_router.get("/{user_shift_id}", response_model=UserShiftSchema)
def get_user_shift(user_shift_id: int):
    user_shift = UserShiftService.get_user_shift_by_id(user_shift_id)
    if not user_shift:
        raise HTTPException(status_code=404, detail="UserShift no encontrado")
    return user_shift

@user_shift_router.post("/", response_model=UserShiftSchema)
def create_user_shift(user_shift: UserShiftSchema):
    user_shift_dict = user_shift.dict(exclude_unset=True)
    new_user_shift = UserShiftService.create_user_shift(user_shift_dict)
    return new_user_shift

@user_shift_router.delete("/{user_shift_id}")
def delete_user_shift(user_shift_id: int):
    result = UserShiftService.soft_delete_user_shift(user_shift_id)
    if not result:
        raise HTTPException(status_code=404, detail="UserShift no encontrado o ya eliminado")
    return {"message": "UserShift eliminado (soft delete)"}

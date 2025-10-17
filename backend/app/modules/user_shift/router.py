# Router del módulo User Shift
from fastapi import APIRouter, Depends, status
from typing import List
from app.modules.user_shift.models import (
    UserShiftCreateSchema,
    UserShiftUpdateSchema,
    UserShiftSchema,
)
from app.modules.user_shift.service import UserShiftService
from app.core.security import get_current_user

user_shift_router = APIRouter()
service = UserShiftService()


@user_shift_router.get("/", response_model=List[UserShiftSchema])
def get_all(current_user=Depends(get_current_user)):
    return service.get_all()


@user_shift_router.get("/{id}", response_model=UserShiftSchema)
def get_by_id(id: int, current_user=Depends(get_current_user)):
    return service.get_by_id(id)


@user_shift_router.get("/by-user/{user_id}", response_model=List[UserShiftSchema])
def by_user(user_id: int, current_user=Depends(get_current_user)):
    return service.get_by_user(user_id)


@user_shift_router.get("/by-shift/{shift_id}", response_model=List[UserShiftSchema])
def by_shift(shift_id: int, current_user=Depends(get_current_user)):
    return service.get_by_shift(shift_id)


@user_shift_router.post("/", response_model=UserShiftSchema, status_code=status.HTTP_201_CREATED)
def create(payload: UserShiftCreateSchema, current_user=Depends(get_current_user)):
    return service.create(payload)


@user_shift_router.put("/{id}", response_model=UserShiftSchema)
def update(id: int, payload: UserShiftUpdateSchema, current_user=Depends(get_current_user)):
    return service.update(id, payload)


@user_shift_router.delete("/{id}")
def delete(id: int, current_user=Depends(get_current_user)):
    return service.delete(id)

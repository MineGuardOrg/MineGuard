# Router del módulo Shift
from fastapi import APIRouter, Depends, status
from typing import List
from app.modules.shift.models import ShiftCreateSchema, ShiftUpdateSchema, ShiftSchema
from app.modules.shift.service import ShiftService
from app.core.security import get_current_user

shift_router = APIRouter()
service = ShiftService()


@shift_router.get("/", response_model=List[ShiftSchema])
def get_all(current_user=Depends(get_current_user)):
    return service.get_all()


@shift_router.get("/{shift_id}", response_model=ShiftSchema)
def get_by_id(shift_id: int, current_user=Depends(get_current_user)):
    return service.get_by_id(shift_id)


@shift_router.post("/", response_model=ShiftSchema, status_code=status.HTTP_201_CREATED)
def create(payload: ShiftCreateSchema, current_user=Depends(get_current_user)):
    return service.create(payload)


@shift_router.put("/{shift_id}", response_model=ShiftSchema)
def update(shift_id: int, payload: ShiftUpdateSchema, current_user=Depends(get_current_user)):
    return service.update(shift_id, payload)


@shift_router.delete("/{shift_id}")
def delete(shift_id: int, current_user=Depends(get_current_user)):
    return service.delete(shift_id)

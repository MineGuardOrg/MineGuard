# Router del módulo Position
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.modules.position.models import (
    PositionCreateSchema,
    PositionUpdateSchema,
    PositionSchema
)
from app.modules.position.service import PositionService
from app.core.security import get_current_user

# Crear instancia del router
position_router = APIRouter()

# Instancia del servicio
position_service = PositionService()

@position_router.get("/", response_model=List[PositionSchema])
def get_all_positions(current_user = Depends(get_current_user)):
    """Obtiene todas las posiciones activas"""
    return position_service.get_all()

@position_router.get("/{position_id}", response_model=PositionSchema)
def get_position_by_id(position_id: int, current_user = Depends(get_current_user)):
    """Obtiene una posición por ID"""
    return position_service.get_by_id(position_id)

@position_router.post("/", response_model=PositionSchema, status_code=status.HTTP_201_CREATED)
def create_position(position_data: PositionCreateSchema, current_user = Depends(get_current_user)):
    """Crea una nueva posición"""
    return position_service.create(position_data)

@position_router.put("/{position_id}", response_model=PositionSchema)
def update_position(position_id: int, position_data: PositionUpdateSchema, current_user = Depends(get_current_user)):
    """Actualiza una posición existente"""
    return position_service.update(position_id, position_data)

@position_router.delete("/{position_id}")
def delete_position(position_id: int, current_user = Depends(get_current_user)):
    """Elimina una posición (soft delete)"""
    return position_service.delete(position_id)
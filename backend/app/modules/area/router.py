# Router del módulo Area
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.modules.area.models import (
    AreaCreateSchema,
    AreaUpdateSchema,
    AreaSchema
)
from app.modules.area.service import AreaService
from app.core.security import get_current_user

# Crear instancia del router
area_router = APIRouter()

# Instancia del servicio
area_service = AreaService()

@area_router.get("/", response_model=List[AreaSchema])
def get_all_areas(current_user = Depends(get_current_user)):
    """Obtiene todas las áreas activas"""
    return area_service.get_all()

@area_router.get("/{area_id}", response_model=AreaSchema)
def get_area_by_id(area_id: int, current_user = Depends(get_current_user)):
    """Obtiene un área por ID"""
    return area_service.get_by_id(area_id)

@area_router.post("/", response_model=AreaSchema, status_code=status.HTTP_201_CREATED)
def create_area(area_data: AreaCreateSchema, current_user = Depends(get_current_user)):
    """Crea una nueva área"""
    return area_service.create(area_data)

@area_router.put("/{area_id}", response_model=AreaSchema)
def update_area(area_id: int, area_data: AreaUpdateSchema, current_user = Depends(get_current_user)):
    """Actualiza un área existente"""
    return area_service.update(area_id, area_data)

@area_router.delete("/{area_id}")
def delete_area(area_id: int, current_user = Depends(get_current_user)):
    """Elimina un área (soft delete)"""
    return area_service.delete(area_id)
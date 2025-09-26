from fastapi import APIRouter, HTTPException
from app.application.area_service import AreaService
from app.domain.schemas.area_schema import AreaSchema

area_router = APIRouter()

@area_router.get("/", response_model=list[AreaSchema])
def get_all_areas():
    return AreaService.get_all_areas()

@area_router.get("/{area_id}", response_model=AreaSchema)
def get_area(area_id: int):
    area = AreaService.get_area_by_id(area_id)
    if not area:
        raise HTTPException(status_code=404, detail="Área no encontrada")
    return area

@area_router.post("/", response_model=AreaSchema)
def create_area(area: AreaSchema):
    area_dict = area.dict(exclude_unset=True)
    new_area = AreaService.create_area(area_dict)
    return new_area

@area_router.delete("/{area_id}")
def delete_area(area_id: int):
    result = AreaService.soft_delete_area(area_id)
    if not result:
        raise HTTPException(status_code=404, detail="Área no encontrada o ya eliminada")
    return {"message": "Área eliminada (soft delete)"}

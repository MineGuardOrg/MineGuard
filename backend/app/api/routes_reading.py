from fastapi import APIRouter, HTTPException
from app.application.reading_service import ReadingService
from app.domain.schemas.reading_schema import ReadingSchema

reading_router = APIRouter()

@reading_router.get("/", response_model=list[ReadingSchema])
def get_all_readings():
    return ReadingService.get_all_readings()

@reading_router.get("/{reading_id}", response_model=ReadingSchema)
def get_reading(reading_id: int):
    reading = ReadingService.get_reading_by_id(reading_id)
    if not reading:
        raise HTTPException(status_code=404, detail="Lectura no encontrada")
    return reading

@reading_router.post("/", response_model=ReadingSchema)
def create_reading(reading: ReadingSchema):
    reading_dict = reading.dict(exclude_unset=True)
    new_reading = ReadingService.create_reading(reading_dict)
    return new_reading

@reading_router.delete("/{reading_id}")
def delete_reading(reading_id: int):
    result = ReadingService.soft_delete_reading(reading_id)
    if not result:
        raise HTTPException(status_code=404, detail="Lectura no encontrada o ya eliminada")
    return {"message": "Lectura eliminada (soft delete)"}

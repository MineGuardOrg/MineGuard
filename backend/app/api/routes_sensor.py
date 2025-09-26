from fastapi import APIRouter, HTTPException
from app.application.sensor_service import SensorService
from app.domain.schemas.sensor_schema import SensorSchema

sensor_router = APIRouter()

@sensor_router.get("/", response_model=list[SensorSchema])
def get_all_sensors():
    return SensorService.get_all_sensors()

@sensor_router.get("/{sensor_id}", response_model=SensorSchema)
def get_sensor(sensor_id: int):
    sensor = SensorService.get_sensor_by_id(sensor_id)
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor no encontrado")
    return sensor

@sensor_router.post("/", response_model=SensorSchema)
def create_sensor(sensor: SensorSchema):
    sensor_dict = sensor.dict(exclude_unset=True)
    new_sensor = SensorService.create_sensor(sensor_dict)
    return new_sensor

@sensor_router.delete("/{sensor_id}")
def delete_sensor(sensor_id: int):
    result = SensorService.soft_delete_sensor(sensor_id)
    if not result:
        raise HTTPException(status_code=404, detail="Sensor no encontrado o ya eliminado")
    return {"message": "Sensor eliminado (soft delete)"}

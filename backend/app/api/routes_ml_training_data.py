from fastapi import APIRouter, HTTPException
from app.application.ml_training_data_service import MLTrainingDataService
from app.domain.schemas.ml_training_data_schema import MLTrainingDataSchema

ml_training_data_router = APIRouter()

@ml_training_data_router.get("/", response_model=list[MLTrainingDataSchema])
def get_all_ml_training_data():
    return MLTrainingDataService.get_all_ml_training_data()

@ml_training_data_router.get("/{data_id}", response_model=MLTrainingDataSchema)
def get_ml_training_data(data_id: int):
    data = MLTrainingDataService.get_ml_training_data_by_id(data_id)
    if not data:
        raise HTTPException(status_code=404, detail="Dato de entrenamiento no encontrado")
    return data

@ml_training_data_router.post("/", response_model=MLTrainingDataSchema)
def create_ml_training_data(data: MLTrainingDataSchema):
    data_dict = data.dict(exclude_unset=True)
    new_data = MLTrainingDataService.create_ml_training_data(data_dict)
    return new_data

@ml_training_data_router.delete("/{data_id}")
def delete_ml_training_data(data_id: int):
    result = MLTrainingDataService.soft_delete_ml_training_data(data_id)
    if not result:
        raise HTTPException(status_code=404, detail="Dato no encontrado o ya eliminado")
    return {"message": "Dato eliminado (soft delete)"}

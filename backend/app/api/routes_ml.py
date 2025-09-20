# Endpoints para modelos ML
from fastapi import APIRouter

ml_router = APIRouter()

@ml_router.post("/predict")
def predict():
    return {"message": "Predicción ML"}

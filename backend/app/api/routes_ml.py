from fastapi import APIRouter

router = APIRouter()

@router.get("/predict")
def predict():
    return {"prediction": "Este es un resultado de ML (demo)"}

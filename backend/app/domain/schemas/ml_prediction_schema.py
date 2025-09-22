from pydantic import BaseModel

class MLPredictionSchema(BaseModel):
    id: int
    prediction: str
    confidence: float
    is_active: bool
    created_at: str
    updated_at: str

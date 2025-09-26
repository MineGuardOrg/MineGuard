from pydantic import BaseModel
from datetime import datetime

class MLPredictionSchema(BaseModel):
    id: int
    reading_id: int
    prediction: str
    probability: float
    created_at: datetime

    class Config:
        orm_mode = True

from pydantic import BaseModel
from datetime import datetime

class MLTrainingDataSchema(BaseModel):
    id: int
    reading_id: int
    label: str
    created_at: datetime

    class Config:
        orm_mode = True

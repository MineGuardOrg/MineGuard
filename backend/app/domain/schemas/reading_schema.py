from pydantic import BaseModel
from datetime import datetime

class ReadingSchema(BaseModel):
    id: int
    value: float
    sensor_id: int
    user_id: int
    timestamp: datetime

    class Config:
        orm_mode = True

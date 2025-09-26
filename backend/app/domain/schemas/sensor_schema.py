from pydantic import BaseModel
from datetime import datetime

class SensorSchema(BaseModel):
    id: int
    name: str
    description: str
    unit: str
    type: str
    device_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

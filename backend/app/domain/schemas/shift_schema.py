from pydantic import BaseModel
from datetime import time, datetime

class ShiftSchema(BaseModel):
    id: int
    start_time: time
    end_time: time
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

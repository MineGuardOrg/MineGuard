from pydantic import BaseModel
from datetime import datetime

class DeviceSchema(BaseModel):
    id: int
    model: str
    user_id: int
    is_active: bool
    assigned_at: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

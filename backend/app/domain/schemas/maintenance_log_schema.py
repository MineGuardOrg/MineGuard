from pydantic import BaseModel
from datetime import datetime

class MaintenanceLogSchema(BaseModel):
    id: int
    description: str
    device_id: int
    performed_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

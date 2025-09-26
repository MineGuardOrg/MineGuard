from pydantic import BaseModel
from datetime import datetime

class IncidentReportSchema(BaseModel):
    id: int
    description: str
    severity: str
    user_id: int
    device_id: int
    reading_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

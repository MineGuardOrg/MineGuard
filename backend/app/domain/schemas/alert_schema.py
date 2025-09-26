from pydantic import BaseModel
from datetime import datetime

class AlertSchema(BaseModel):
    id: int
    alert_type: str
    severity: str
    reading_id: int
    timestamp: datetime

    class Config:
        orm_mode = True

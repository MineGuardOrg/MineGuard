from pydantic import BaseModel
from datetime import datetime

class ConnectionSchema(BaseModel):
    id: int
    device_id: int
    status: str
    timestamp: datetime

    class Config:
        orm_mode = True

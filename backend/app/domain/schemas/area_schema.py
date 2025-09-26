from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AreaSchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

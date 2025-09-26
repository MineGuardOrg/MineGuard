from pydantic import BaseModel
from datetime import datetime

class RoleSchema(BaseModel):
    id: int
    name: str
    description: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

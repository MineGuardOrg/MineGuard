from pydantic import BaseModel

class MaintenanceLogSchema(BaseModel):
    id: int
    description: str
    date: str
    is_active: bool

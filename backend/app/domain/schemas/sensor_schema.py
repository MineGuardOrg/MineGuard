from pydantic import BaseModel

class SensorSchema(BaseModel):
    id: int
    type: str
    is_active: bool
    created_at: str
    updated_at: str

from pydantic import BaseModel

class PositionSchema(BaseModel):
    id: int
    name: str
    description: str
    is_active: bool
    created_at: str
    updated_at: str

from pydantic import BaseModel

class AlertSchema(BaseModel):
    id: int
    type: str
    description: str
    is_active: bool
    created_at: str
    updated_at: str

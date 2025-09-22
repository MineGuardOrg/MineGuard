from pydantic import BaseModel

class AreaSchema(BaseModel):
    id: int
    name: str
    description: str
    is_active: bool
    created_at: str
    updated_at: str

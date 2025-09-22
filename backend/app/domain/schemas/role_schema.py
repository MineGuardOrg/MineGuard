from pydantic import BaseModel

class RoleSchema(BaseModel):
    id: int
    name: str
    description: str
    is_active: bool
    created_at: str
    updated_at: str

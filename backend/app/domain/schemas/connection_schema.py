from pydantic import BaseModel

class ConnectionSchema(BaseModel):
    id: int
    device_id: int
    status: str
    is_active: bool
    created_at: str
    updated_at: str

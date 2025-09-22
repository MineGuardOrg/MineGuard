from pydantic import BaseModel

class DeviceSchema(BaseModel):
    id: int
    name: str
    serial_number: str
    is_active: bool
    created_at: str
    updated_at: str

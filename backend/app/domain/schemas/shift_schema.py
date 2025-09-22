from pydantic import BaseModel

class ShiftSchema(BaseModel):
    id: int
    name: str
    start_time: str
    end_time: str
    is_active: bool

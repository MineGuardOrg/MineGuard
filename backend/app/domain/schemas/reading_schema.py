from pydantic import BaseModel

class ReadingSchema(BaseModel):
    id: int
    value: float
    timestamp: str
    is_active: bool

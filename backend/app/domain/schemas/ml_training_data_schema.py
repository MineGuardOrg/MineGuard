from pydantic import BaseModel

class MLTrainingDataSchema(BaseModel):
    id: int
    data: str
    label: str
    is_active: bool
    created_at: str
    updated_at: str

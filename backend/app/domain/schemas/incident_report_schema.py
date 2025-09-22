from pydantic import BaseModel

class IncidentReportSchema(BaseModel):
    id: int
    title: str
    description: str
    is_active: bool
    created_at: str
    updated_at: str

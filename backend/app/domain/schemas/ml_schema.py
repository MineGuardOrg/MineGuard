# Schema de ML
from pydantic import BaseModel

class MLSchema(BaseModel):
    input_data: dict

# Schema de autenticación
from pydantic import BaseModel

class AuthSchema(BaseModel):
    username: str
    password: str

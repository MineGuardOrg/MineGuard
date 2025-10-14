# Schema de autenticación
from pydantic import BaseModel

class LoginSchema(BaseModel):
    employee_number: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

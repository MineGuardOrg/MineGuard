# Schemas de usuario para distintos endpoints
from pydantic import BaseModel

class UserCreateSchema(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    role_id: int | None = None
    area_id: int | None = None
    position_id: int | None = None
    supervisor_id: int | None = None

class UserSchema(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    role_id: int
    area_id: int | None = None
    position_id: int | None = None
    supervisor_id: int | None = None
    is_active: bool
    created_at: str
    updated_at: str

class UserUpdateSchema(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    password: str | None = None
    role_id: int | None = None
    area_id: int | None = None
    position_id: int | None = None
    supervisor_id: int | None = None

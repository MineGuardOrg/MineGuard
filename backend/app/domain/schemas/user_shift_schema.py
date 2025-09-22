from pydantic import BaseModel

class UserShiftSchema(BaseModel):
    id: int
    user_id: int
    shift_id: int
    is_active: bool

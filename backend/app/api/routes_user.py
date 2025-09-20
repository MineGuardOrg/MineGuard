# Endpoints de usuarios
from fastapi import APIRouter

user_router = APIRouter()

@user_router.get("/users")
def get_users():
    return {"message": "Lista de usuarios"}

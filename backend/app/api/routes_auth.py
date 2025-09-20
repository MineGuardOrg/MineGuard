# Endpoints de autenticación
from fastapi import APIRouter

auth_router = APIRouter()

@auth_router.post("/login")
def login():
    return {"message": "Login"}

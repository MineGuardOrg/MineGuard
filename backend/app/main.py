
from fastapi import FastAPI
from app.core import logging_config  # Cargar configuración de logs

# Importar todos los routers de módulos
from app.modules.auth.router import auth_router
from app.modules.users.router import user_router
from app.modules.role.router import role_router
from app.modules.area.router import area_router  
from app.modules.position.router import position_router

app = FastAPI(title="MineGuard API", version="1.0.0")

# Registrar routers (orden alfabético por tag)
app.include_router(area_router, prefix="/areas", tags=["Areas"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(position_router, prefix="/positions", tags=["Positions"])
app.include_router(role_router, prefix="/roles", tags=["Roles"])
app.include_router(user_router, prefix="/users", tags=["Users"])

@app.get("/")
def root():
    return {"message": "MineGuard API is running 🚀"}

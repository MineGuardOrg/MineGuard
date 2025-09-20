from fastapi import FastAPI
from app.api.routes_user import user_router
from app.api.routes_auth import auth_router
from app.api.routes_ml import ml_router
app = FastAPI(title="MineGuard API")

# Registrar routers
# Registrar routers
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(ml_router, prefix="/ml", tags=["ML"])

@app.get("/")
def root():
    return {"message": "MineGuard API is running 🚀"}

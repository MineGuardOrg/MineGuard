from fastapi import FastAPI
from app.api import routes_user, routes_auth, routes_ml

app = FastAPI(title="MineGuard API")

# Registrar routers
app.include_router(routes_user.router, prefix="/users", tags=["Users"])
app.include_router(routes_auth.router, prefix="/auth", tags=["Auth"])
app.include_router(routes_ml.router, prefix="/ml", tags=["ML"])

@app.get("/")
def root():
    return {"message": "MineGuard API is running 🚀"}

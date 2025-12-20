from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import students, dataset, ml_routes, dashboard, evaluaciones, ml_evaluaciones
from app.database import engine, Base

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MineGuard API",
    description="API para predicción de reprobación estudiantil con análisis académico completo",
    version="2.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(students.router, prefix="/api", tags=["Students"])
app.include_router(dataset.router, prefix="/api", tags=["Dataset"])
app.include_router(ml_routes.router, prefix="/api", tags=["Machine Learning"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(evaluaciones.router, prefix="/api", tags=["Evaluaciones Académicas"])
app.include_router(ml_evaluaciones.router, prefix="/api", tags=["ML Evaluaciones"])

@app.get("/")
async def root():
    return {
        "message": "Bienvenido a MineGuard API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


from fastapi import FastAPI
from app.core import logging_config  # Cargar configuración de logs

# Importar todos los routers de módulos
from app.modules.auth.router import auth_router
from app.modules.users.router import user_router
from app.modules.role.router import role_router
from app.modules.area.router import area_router  
from app.modules.position.router import position_router
from app.modules.device.router import device_router
from app.modules.sensor.router import sensor_router
from app.modules.reading.router import reading_router
from app.modules.alert.router import alert_router
from app.modules.incident_report.router import incident_report_router
from app.modules.maintenance_log.router import maintenance_log_router
from app.modules.shift.router import shift_router
from app.modules.user_shift.router import user_shift_router
from app.modules.connection.router import connection_router
from app.modules.ml_training_data.router import ml_training_data_router
from app.modules.ml_prediction.router import ml_prediction_router
from app.modules.dashboard.router import dashboard_router

app = FastAPI(title="MineGuard API", version="1.0.0")

# Registrar routers (orden alfabético por tag)
app.include_router(alert_router, prefix="/alerts", tags=["Alerts"])
app.include_router(area_router, prefix="/areas", tags=["Areas"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(connection_router, prefix="/connections", tags=["Connections"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(device_router, prefix="/devices", tags=["Devices"])
app.include_router(incident_report_router, prefix="/incidents", tags=["Incidents"])
app.include_router(maintenance_log_router, prefix="/maintenance", tags=["Maintenance"])
app.include_router(ml_prediction_router, prefix="/ml-predictions", tags=["MLPredictions"])
app.include_router(ml_training_data_router, prefix="/ml-training-data", tags=["MLTrainingData"])
app.include_router(position_router, prefix="/positions", tags=["Positions"])
app.include_router(reading_router, prefix="/readings", tags=["Readings"])
app.include_router(role_router, prefix="/roles", tags=["Roles"])
app.include_router(sensor_router, prefix="/sensors", tags=["Sensors"])
app.include_router(shift_router, prefix="/shifts", tags=["Shifts"])
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(user_shift_router, prefix="/user-shifts", tags=["UserShifts"])

@app.get("/")
def root():
    return {"message": "MineGuard API is running 🚀"}

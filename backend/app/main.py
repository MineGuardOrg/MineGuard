
from fastapi import FastAPI
from app.api.routes_user import user_router
from app.api.routes_auth import auth_router
from app.api.routes_ml import ml_router
from app.api.routes_role import role_router
from app.api.routes_device import device_router
from app.api.routes_area import area_router
from app.api.routes_position import position_router
from app.api.routes_alert import alert_router
from app.api.routes_connection import connection_router
from app.api.routes_incident_report import incident_report_router
from app.api.routes_maintenance_log import maintenance_log_router
from app.api.routes_ml_prediction import ml_prediction_router
from app.api.routes_ml_training_data import ml_training_data_router
from app.api.routes_reading import reading_router
from app.api.routes_sensor import sensor_router
from app.api.routes_shift import shift_router
from app.api.routes_user_shift import user_shift_router
app = FastAPI(title="MineGuard API")

# Registrar routers
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(role_router, prefix="/roles", tags=["Roles"])
app.include_router(device_router, prefix="/devices", tags=["Devices"])
app.include_router(area_router, prefix="/areas", tags=["Areas"])
app.include_router(position_router, prefix="/positions", tags=["Positions"])
app.include_router(alert_router, prefix="/alerts", tags=["Alerts"])
app.include_router(connection_router, prefix="/connections", tags=["Connections"])
app.include_router(incident_report_router, prefix="/incident-reports", tags=["IncidentReports"])
app.include_router(maintenance_log_router, prefix="/maintenance-logs", tags=["MaintenanceLogs"])
app.include_router(ml_prediction_router, prefix="/ml-predictions", tags=["MLPredictions"])
app.include_router(ml_training_data_router, prefix="/ml-training-data", tags=["MLTrainingData"])
app.include_router(reading_router, prefix="/readings", tags=["Readings"])
app.include_router(sensor_router, prefix="/sensors", tags=["Sensors"])
app.include_router(shift_router, prefix="/shifts", tags=["Shifts"])
app.include_router(user_shift_router, prefix="/user-shifts", tags=["UserShifts"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(ml_router, prefix="/ml", tags=["ML"])

@app.get("/")
def root():
    return {"message": "MineGuard API is running 🚀"}

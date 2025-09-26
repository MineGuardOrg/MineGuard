from fastapi import APIRouter, HTTPException
from app.application.maintenance_log_service import MaintenanceLogService
from app.domain.schemas.maintenance_log_schema import MaintenanceLogSchema

maintenance_log_router = APIRouter()

@maintenance_log_router.get("/", response_model=list[MaintenanceLogSchema])
def get_all_maintenance_logs():
    return MaintenanceLogService.get_all_maintenance_logs()

@maintenance_log_router.get("/{log_id}", response_model=MaintenanceLogSchema)
def get_maintenance_log(log_id: int):
    log = MaintenanceLogService.get_maintenance_log_by_id(log_id)
    if not log:
        raise HTTPException(status_code=404, detail="Log de mantenimiento no encontrado")
    return log

@maintenance_log_router.post("/", response_model=MaintenanceLogSchema)
def create_maintenance_log(log: MaintenanceLogSchema):
    log_dict = log.dict(exclude_unset=True)
    new_log = MaintenanceLogService.create_maintenance_log(log_dict)
    return new_log

@maintenance_log_router.delete("/{log_id}")
def delete_maintenance_log(log_id: int):
    result = MaintenanceLogService.soft_delete_maintenance_log(log_id)
    if not result:
        raise HTTPException(status_code=404, detail="Log no encontrado o ya eliminado")
    return {"message": "Log eliminado (soft delete)"}

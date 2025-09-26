from fastapi import APIRouter, HTTPException
from app.application.alert_service import AlertService
from app.domain.schemas.alert_schema import AlertSchema

alert_router = APIRouter()

@alert_router.get("/", response_model=list[AlertSchema])
def get_all_alerts():
    return AlertService.get_all_alerts()

@alert_router.get("/{alert_id}", response_model=AlertSchema)
def get_alert(alert_id: int):
    alert = AlertService.get_alert_by_id(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alerta no encontrada")
    return alert

@alert_router.post("/", response_model=AlertSchema)
def create_alert(alert: AlertSchema):
    alert_dict = alert.dict(exclude_unset=True)
    new_alert = AlertService.create_alert(alert_dict)
    return new_alert

@alert_router.delete("/{alert_id}")
def delete_alert(alert_id: int):
    result = AlertService.soft_delete_alert(alert_id)
    if not result:
        raise HTTPException(status_code=404, detail="Alerta no encontrada o ya eliminada")
    return {"message": "Alerta eliminada (soft delete)"}

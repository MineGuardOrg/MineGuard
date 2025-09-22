# DAO para dispositivos
from app.domain.entities.device import Device
from app.infrastructure.database import SessionLocal

class DeviceDAO:
    @staticmethod
    def get_by_id(device_id: int):
        db = SessionLocal()
        device = db.query(Device).filter(Device.id == device_id, Device.is_active == True).first()
        db.close()
        return device
    
    @staticmethod
    def soft_delete(device_id: int):
        db = SessionLocal()
        device = db.query(Device).filter(Device.id == device_id, Device.is_active == True).first()
        if device:
            device.is_active = False
            db.commit()
        db.close()
        return device

    @staticmethod
    def create(device_data: dict):
        db = SessionLocal()
        device = Device(**device_data)
        db.add(device)
        db.commit()
        db.refresh(device)
        db.close()
        return device

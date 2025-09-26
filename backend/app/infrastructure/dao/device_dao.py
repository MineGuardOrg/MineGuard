# DAO para dispositivos
from app.domain.entities.device import Device
from app.infrastructure.database import SessionLocal

class DeviceDAO:
    @staticmethod
    def get_all():
        with SessionLocal() as db:
            return db.query(Device).filter(Device.is_active == True).all()
    
    @staticmethod
    def get_by_id(device_id: int):
        with SessionLocal() as db:
            return db.query(Device).filter(Device.id == device_id, Device.is_active == True).first()

    @staticmethod
    def soft_delete(device_id: int):
        with SessionLocal() as db:
            device = db.query(Device).filter(Device.id == device_id, Device.is_active == True).first()
            if device:
                device.is_active = False
                db.commit()
            return device

    @staticmethod
    def create(device_data: dict):
        with SessionLocal() as db:
            device = Device(**device_data)
            db.add(device)
            db.commit()
            db.refresh(device)
            return device

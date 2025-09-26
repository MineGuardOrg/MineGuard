# Lógica de negocio para dispositivos
from app.infrastructure.dao.device_dao import DeviceDAO
from app.domain.schemas.device_schema import DeviceSchema

class DeviceService:
    @staticmethod
    def get_all_devices():
        devices = DeviceDAO.get_all()
        return [DeviceSchema.from_orm(d) for d in devices]

    @staticmethod
    def get_device_by_id(device_id: int):
        device = DeviceDAO.get_by_id(device_id)
        if device:
            return DeviceSchema(
                id=device.id,
                model=device.model,
                user_id=device.user_id,
                is_active=device.is_active,
                assigned_at=device.assigned_at,
                created_at=device.created_at,
                updated_at=device.updated_at
            )
        return None

    @staticmethod
    def create_device(device_data: dict):
        device = DeviceDAO.create(device_data)
        return DeviceSchema(
            id=device.id,
            model=device.model,
            user_id=device.user_id,
            is_active=device.is_active,
            assigned_at=device.assigned_at,
            created_at=device.created_at,
            updated_at=device.updated_at
        )

    @staticmethod
    def soft_delete_device(device_id: int):
        device = DeviceDAO.soft_delete(device_id)
        if device:
            return True
        return False

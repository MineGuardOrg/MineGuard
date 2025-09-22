# Lógica de negocio para usuarios

from app.infrastructure.dao.user_dao import UserDAO
from app.domain.schemas.user_schema import UserSchema

class UserService:
    @staticmethod
    def get_all_users():
        users = UserDAO.get_all()
        return [UserSchema(
            id=u.id,
            first_name=u.first_name,
            last_name=u.last_name,
            email=u.email,
            role_id=u.role_id,
            area_id=u.area_id,
            position_id=u.position_id,
            supervisor_id=u.supervisor_id,
            is_active=u.is_active,
            created_at=str(u.created_at),
            updated_at=str(u.updated_at)
        ) for u in users]
    
    @staticmethod
    def get_user_by_id(user_id: int):
        user = UserDAO.get_by_id(user_id)
        if user:
            return UserSchema(
                id=user.id,
                first_name=user.first_name,
                last_name=user.last_name,
                email=user.email,
                role_id=user.role_id,
                area_id=user.area_id,
                position_id=user.position_id,
                supervisor_id=user.supervisor_id,
                is_active=user.is_active,
                created_at=str(user.created_at),
                updated_at=str(user.updated_at)
            )
        return None

    @staticmethod
    def create_user(user_data: dict):
        # Asignar role_id=2 por defecto si no se especifica
        if "role_id" not in user_data or user_data["role_id"] is None:
            user_data["role_id"] = 2
        # Limpiar campos opcionales: si llegan como 0, poner None
        for field in ["area_id", "position_id", "supervisor_id"]:
            if field in user_data and user_data[field] == 0:
                user_data[field] = None
        # Excluir campos automáticos si por alguna razón llegan
        user_data.pop("created_at", None)
        user_data.pop("updated_at", None)
        user = UserDAO.create(user_data)
        return UserSchema(
            id=user.id,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            role_id=user.role_id,
            area_id=user.area_id,
            position_id=user.position_id,
            supervisor_id=user.supervisor_id,
            is_active=user.is_active,
            created_at=str(user.created_at),
            updated_at=str(user.updated_at)
        )

    @staticmethod
    def soft_delete_user(user_id: int):
        user = UserDAO.soft_delete(user_id)
        if user:
            return True
        return False

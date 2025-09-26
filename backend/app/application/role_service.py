# Lógica de negocio para roles
from app.infrastructure.dao.role_dao import RoleDAO
from app.domain.schemas.role_schema import RoleSchema

class RoleService:
    @staticmethod
    def get_all_roles():
        roles = RoleDAO.get_all()
        return [RoleSchema.from_orm(r) for r in roles]

    @staticmethod
    def get_role_by_id(role_id: int):
        role = RoleDAO.get_by_id(role_id)
        if role:
            return RoleSchema(
                id=role.id,
                name=role.name,
                description=role.description,
                is_active=role.is_active,
                created_at=role.created_at,
                updated_at=role.updated_at
            )
        return None

    @staticmethod
    def create_role(role_data: dict):
        role = RoleDAO.create(role_data)
        return RoleSchema(
            id=role.id,
            name=role.name,
            description=role.description,
            is_active=role.is_active,
            created_at=role.created_at,
            updated_at=role.updated_at
        )

    @staticmethod
    def soft_delete_role(role_id: int):
        role = RoleDAO.soft_delete(role_id)
        if role:
            return True
        return False

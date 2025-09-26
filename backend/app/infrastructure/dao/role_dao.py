# DAO para roles
from app.domain.entities.role import Role
from app.infrastructure.database import SessionLocal

class RoleDAO:
    @staticmethod
    def get_all():
        with SessionLocal() as db:
            return db.query(Role).filter(Role.is_active == True).all()

    @staticmethod
    def get_by_id(role_id: int):
        with SessionLocal() as db:
            return db.query(Role).filter(Role.id == role_id, Role.is_active == True).first()

    @staticmethod
    def soft_delete(role_id: int):
        with SessionLocal() as db:
            role = db.query(Role).filter(Role.id == role_id, Role.is_active == True).first()
            if role:
                role.is_active = False
                db.commit()
            return role

    @staticmethod
    def create(role_data: dict):
        with SessionLocal() as db:
            role = Role(**role_data)
            db.add(role)
            db.commit()
            db.refresh(role)
            return role

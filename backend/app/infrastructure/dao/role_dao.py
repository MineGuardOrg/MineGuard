# DAO para roles
from app.domain.entities.role import Role
from app.infrastructure.database import SessionLocal

class RoleDAO:
    @staticmethod
    def get_by_id(role_id: int):
        db = SessionLocal()
        role = db.query(Role).filter(Role.id == role_id, Role.is_active == True).first()
        db.close()
        return role
    
    @staticmethod
    def soft_delete(role_id: int):
        db = SessionLocal()
        role = db.query(Role).filter(Role.id == role_id, Role.is_active == True).first()
        if role:
            role.is_active = False
            db.commit()
        db.close()
        return role

    @staticmethod
    def create(role_data: dict):
        db = SessionLocal()
        role = Role(**role_data)
        db.add(role)
        db.commit()
        db.refresh(role)
        db.close()
        return role

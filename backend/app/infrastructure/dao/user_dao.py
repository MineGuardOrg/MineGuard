# DAO para usuarios
from app.domain.entities.user import User
from app.infrastructure.database import SessionLocal

class UserDAO:
    @staticmethod
    def get_all():
        db = SessionLocal()
        return db.query(User).filter(User.is_active == True).all()
        db.close()
        return users
    @staticmethod
    def get_by_id(user_id: int):
        db = SessionLocal()
        return db.query(User).filter(User.id == user_id, User.is_active == True).first()
        db.close()
        return user
    
    @staticmethod
    def soft_delete(user_id: int):
        db = SessionLocal()
        user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
        if user:
            user.is_active = False
            db.commit()
        db.close()
        return user

    @staticmethod
    def create(user_data: dict):
        # Excluir campos que la BD asigna automáticamente y que sean None
        user_data.pop("updated_at", None)
        user_data.pop("created_at", None)
        db = SessionLocal()
        user = User(**user_data)
        db.add(user)
        db.commit()
        db.refresh(user)
        db.close()
        return user

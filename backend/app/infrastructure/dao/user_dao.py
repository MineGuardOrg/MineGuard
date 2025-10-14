# DAO para usuarios
from app.domain.entities.user import User
from app.infrastructure.database import SessionLocal

class UserDAO:
    @staticmethod
    def get_all():
        with SessionLocal() as db:
            return db.query(User).filter(User.is_active == True).all()

    @staticmethod
    def get_by_id(user_id: int):
        with SessionLocal() as db:
            return db.query(User).filter(User.id == user_id, User.is_active == True).first()

    @staticmethod
    def get_by_employee_number(employee_number: str):
        with SessionLocal() as db:
            return db.query(User).filter(User.employee_number == employee_number, User.is_active == True).first()

    @staticmethod
    def get_by_email(email: str):
        with SessionLocal() as db:
            return db.query(User).filter(User.email == email, User.is_active == True).first()

    @staticmethod
    def soft_delete(user_id: int):
        with SessionLocal() as db:
            user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
            if user:
                user.is_active = False
                db.commit()
            return user

    @staticmethod
    def create(user_data: dict):
        user_data.pop("updated_at", None)
        user_data.pop("created_at", None)
        with SessionLocal() as db:
            user = User(**user_data)
            db.add(user)
            db.commit()
            db.refresh(user)
            return user

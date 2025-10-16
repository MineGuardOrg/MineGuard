# Repositorio del módulo Users
from typing import Optional, List
from app.shared.base_repository import BaseRepository
from app.modules.users.models import User

class UserRepository(BaseRepository[User]):
    """Repositorio específico para operaciones de usuarios"""
    
    def __init__(self):
        super().__init__(User)
    
    def get_by_employee_number(self, employee_number: str) -> Optional[User]:
        """Obtiene un usuario por número de empleado"""
        from app.core.database import SessionLocal
        with SessionLocal() as db:
            return db.query(self.model).filter(
                self.model.employee_number == employee_number,
                self.model.is_active == True
            ).first()
    
    def get_by_email(self, email: str) -> Optional[User]:
        """Obtiene un usuario por email"""
        from app.core.database import SessionLocal
        with SessionLocal() as db:
            return db.query(self.model).filter(
                self.model.email == email,
                self.model.is_active == True
            ).first()
    
    def get_by_role(self, role_id: int) -> List[User]:
        """Obtiene todos los usuarios por rol"""
        from app.core.database import SessionLocal
        with SessionLocal() as db:
            return db.query(self.model).filter(
                self.model.role_id == role_id,
                self.model.is_active == True
            ).all()
    
    def get_by_area(self, area_id: int) -> List[User]:
        """Obtiene todos los usuarios por área"""
        from app.core.database import SessionLocal
        with SessionLocal() as db:
            return db.query(self.model).filter(
                self.model.area_id == area_id,
                self.model.is_active == True
            ).all()
    
    def get_subordinates(self, supervisor_id: int) -> List[User]:
        """Obtiene todos los subordinados de un supervisor"""
        from app.core.database import SessionLocal
        with SessionLocal() as db:
            return db.query(self.model).filter(
                self.model.supervisor_id == supervisor_id,
                self.model.is_active == True
            ).all()
    
    def email_exists(self, email: str, exclude_id: Optional[int] = None) -> bool:
        """Verifica si un email ya está registrado"""
        from app.core.database import SessionLocal
        with SessionLocal() as db:
            query = db.query(self.model).filter(
                self.model.email == email,
                self.model.is_active == True
            )
            if exclude_id:
                query = query.filter(self.model.id != exclude_id)
            return query.first() is not None
    
    def employee_number_exists(self, employee_number: str, exclude_id: Optional[int] = None) -> bool:
        """Verifica si un número de empleado ya está registrado"""
        from app.core.database import SessionLocal
        with SessionLocal() as db:
            query = db.query(self.model).filter(
                self.model.employee_number == employee_number,
                self.model.is_active == True
            )
            if exclude_id:
                query = query.filter(self.model.id != exclude_id)
            return query.first() is not None
    
    def search_users(self, search_term: str) -> List[User]:
        """Busca usuarios por nombre, apellido o número de empleado"""
        from app.core.database import SessionLocal
        with SessionLocal() as db:
            search_pattern = f"%{search_term}%"
            return db.query(self.model).filter(
                (self.model.first_name.ilike(search_pattern) |
                 self.model.last_name.ilike(search_pattern) |
                 self.model.employee_number.ilike(search_pattern)),
                self.model.is_active == True
            ).all()
# Repositorio del módulo Auth
from typing import Optional
from app.shared.base_repository import BaseRepository
from app.modules.auth.models import User
from sqlalchemy.orm import joinedload

class AuthRepository(BaseRepository[User]):
    """Repositorio específico para operaciones de autenticación"""
    
    def __init__(self):
        super().__init__(User)
    
    def get_by_employee_number(self, employee_number: str) -> Optional[User]:
        """Obtiene un usuario por número de empleado"""
        from app.core.database import SessionLocal
        with SessionLocal() as db:
            return db.query(self.model).options(joinedload(self.model.role)).filter(
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
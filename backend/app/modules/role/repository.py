# Repositorio del módulo Role
from typing import Optional
from app.shared.base_repository import BaseRepository
from app.modules.role.models import Role

class RoleRepository(BaseRepository[Role]):
    """Repositorio específico para operaciones de Role"""
    
    def __init__(self):
        super().__init__(Role)
    
    def get_by_name(self, name: str) -> Optional[Role]:
        """Obtiene un rol por nombre"""
        from app.core.database import SessionLocal
        with SessionLocal() as db:
            return db.query(self.model).filter(
                self.model.name == name,
                self.model.is_active == True
            ).first()
    
    def name_exists(self, name: str, exclude_id: Optional[int] = None) -> bool:
        """Verifica si un nombre de rol ya está registrado"""
        from app.core.database import SessionLocal
        with SessionLocal() as db:
            query = db.query(self.model).filter(
                self.model.name == name,
                self.model.is_active == True
            )
            if exclude_id:
                query = query.filter(self.model.id != exclude_id)
            return query.first() is not None
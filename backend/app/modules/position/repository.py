# Repositorio del módulo Position
from typing import Optional
from app.shared.base_repository import BaseRepository
from app.modules.position.models import Position

class PositionRepository(BaseRepository[Position]):
    """Repositorio específico para operaciones de Position"""
    
    def __init__(self):
        super().__init__(Position)
    
    def get_by_name(self, name: str) -> Optional[Position]:
        """Obtiene una posición por nombre"""
        from app.core.database import SessionLocal
        with SessionLocal() as db:
            return db.query(self.model).filter(
                self.model.name == name,
                self.model.is_active == True
            ).first()
    
    def name_exists(self, name: str, exclude_id: Optional[int] = None) -> bool:
        """Verifica si un nombre de posición ya está registrado"""
        from app.core.database import SessionLocal
        with SessionLocal() as db:
            query = db.query(self.model).filter(
                self.model.name == name,
                self.model.is_active == True
            )
            if exclude_id:
                query = query.filter(self.model.id != exclude_id)
            return query.first() is not None
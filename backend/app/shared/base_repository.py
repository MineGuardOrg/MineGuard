# Repositorio base con operaciones CRUD comunes
from typing import Generic, TypeVar, Type, List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.core.database import SessionLocal

# TypeVars para generics
T = TypeVar('T')  # Para el modelo/entidad
CreateSchemaType = TypeVar('CreateSchemaType')
UpdateSchemaType = TypeVar('UpdateSchemaType')

class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T]):
        self.model = model
    
    def get_all(self, db: Optional[Session] = None) -> List[T]:
        """Obtiene todos los registros (solo activos si el modelo tiene is_active)"""
        def _query(session: Session):
            q = session.query(self.model)
            # Aplicar filtro is_active solo si existe el atributo
            if hasattr(self.model, "is_active"):
                q = q.filter(self.model.is_active == True)
            return q.all()

        if db is None:
            with SessionLocal() as db:
                return _query(db)
        return _query(db)
    
    def get_by_id(self, id: int, db: Optional[Session] = None) -> Optional[T]:
        """Obtiene un registro por ID (solo activos si el modelo tiene is_active)"""
        def _query(session: Session):
            q = session.query(self.model).filter(self.model.id == id)
            if hasattr(self.model, "is_active"):
                q = q.filter(self.model.is_active == True)
            return q.first()

        if db is None:
            with SessionLocal() as db:
                return _query(db)
        return _query(db)
    
    def create(self, data: Dict[str, Any], db: Optional[Session] = None) -> T:
        """Crea un nuevo registro"""
        # Limpiar campos de timestamps que se manejan automáticamente
        data.pop("updated_at", None)
        data.pop("created_at", None)
        
        if db is None:
            with SessionLocal() as db:
                try:
                    instance = self.model(**data)
                    db.add(instance)
                    db.commit()
                    db.refresh(instance)
                    return instance
                except SQLAlchemyError as e:
                    db.rollback()
                    raise e
        else:
            instance = self.model(**data)
            db.add(instance)
            return instance
    
    def update(self, id: int, data: Dict[str, Any], db: Optional[Session] = None) -> Optional[T]:
        """Actualiza un registro existente"""
        # Limpiar campos que no deben ser actualizados manualmente
        data.pop("created_at", None)
        
        if db is None:
            with SessionLocal() as db:
                try:
                    instance = self.get_by_id(id, db)
                    if instance:
                        for key, value in data.items():
                            if hasattr(instance, key) and value is not None:
                                setattr(instance, key, value)
                        db.commit()
                        db.refresh(instance)
                    return instance
                except SQLAlchemyError as e:
                    db.rollback()
                    raise e
        else:
            instance = self.get_by_id(id, db)
            if instance:
                for key, value in data.items():
                    if hasattr(instance, key) and value is not None:
                        setattr(instance, key, value)
            return instance
    
    def soft_delete(self, id: int, db: Optional[Session] = None) -> Optional[T]:
        """Eliminación lógica si existe is_active; de lo contrario, elimina físicamente."""
        if db is None:
            with SessionLocal() as db:
                try:
                    instance = self.get_by_id(id, db)
                    if instance:
                        if hasattr(instance, "is_active"):
                            instance.is_active = False
                            db.commit()
                        else:
                            db.delete(instance)
                            db.commit()
                    return instance
                except SQLAlchemyError as e:
                    db.rollback()
                    raise e
        else:
            instance = self.get_by_id(id, db)
            if instance:
                if hasattr(instance, "is_active"):
                    instance.is_active = False
                else:
                    db.delete(instance)
            return instance
    
    def hard_delete(self, id: int, db: Optional[Session] = None) -> bool:
        """Eliminación física del registro"""
        if db is None:
            with SessionLocal() as db:
                try:
                    instance = self.get_by_id(id, db)
                    if instance:
                        db.delete(instance)
                        db.commit()
                        return True
                    return False
                except SQLAlchemyError as e:
                    db.rollback()
                    raise e
        else:
            instance = self.get_by_id(id, db)
            if instance:
                db.delete(instance)
                return True
            return False
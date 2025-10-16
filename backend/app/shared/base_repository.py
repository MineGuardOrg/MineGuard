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
        """Obtiene todos los registros activos"""
        if db is None:
            with SessionLocal() as db:
                return db.query(self.model).filter(self.model.is_active == True).all()
        return db.query(self.model).filter(self.model.is_active == True).all()
    
    def get_by_id(self, id: int, db: Optional[Session] = None) -> Optional[T]:
        """Obtiene un registro por ID"""
        if db is None:
            with SessionLocal() as db:
                return db.query(self.model).filter(
                    self.model.id == id, 
                    self.model.is_active == True
                ).first()
        return db.query(self.model).filter(
            self.model.id == id, 
            self.model.is_active == True
        ).first()
    
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
        """Eliminación lógica (soft delete) marcando is_active = False"""
        if db is None:
            with SessionLocal() as db:
                try:
                    instance = self.get_by_id(id, db)
                    if instance:
                        instance.is_active = False
                        db.commit()
                    return instance
                except SQLAlchemyError as e:
                    db.rollback()
                    raise e
        else:
            instance = self.get_by_id(id, db)
            if instance:
                instance.is_active = False
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
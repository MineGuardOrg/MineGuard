# Servicio base con lógica de negocio común
from typing import Generic, TypeVar, List, Optional, Dict, Any
from abc import ABC, abstractmethod
from fastapi import HTTPException, status
import logging

# TypeVars para generics
T = TypeVar('T')  # Para el modelo/entidad
CreateSchemaType = TypeVar('CreateSchemaType')
UpdateSchemaType = TypeVar('UpdateSchemaType')
ResponseSchemaType = TypeVar('ResponseSchemaType')

logger = logging.getLogger(__name__)

class BaseService(Generic[T, CreateSchemaType, UpdateSchemaType, ResponseSchemaType], ABC):
    """
    Servicio base abstracto que define operaciones CRUD comunes.
    Cada servicio específico debe heredar de esta clase e implementar
    los métodos abstractos según su lógica de negocio.
    """
    
    def __init__(self, repository):
        self.repository = repository
        self.model_name = self.repository.model.__name__
    
    @abstractmethod
    def _validate_create_data(self, data: CreateSchemaType) -> Dict[str, Any]:
        """
        Valida y prepara los datos para crear un nuevo registro.
        Debe ser implementado por cada servicio específico.
        """
        pass
    
    @abstractmethod
    def _validate_update_data(self, id: int, data: UpdateSchemaType) -> Dict[str, Any]:
        """
        Valida y prepara los datos para actualizar un registro.
        Debe ser implementado por cada servicio específico.
        """
        pass
    
    @abstractmethod
    def _to_response_schema(self, entity: T) -> ResponseSchemaType:
        """
        Convierte una entidad del dominio a su schema de respuesta.
        Debe ser implementado por cada servicio específico.
        """
        pass
    
    def get_all(self) -> List[ResponseSchemaType]:
        """Obtiene todos los registros activos"""
        try:
            entities = self.repository.get_all()
            return [self._to_response_schema(entity) for entity in entities]
        except Exception as e:
            logger.error(f"❌ Error al obtener {self.model_name}s: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error interno del servidor al obtener {self.model_name}s"
            )
    
    def get_by_id(self, id: int) -> ResponseSchemaType:
        """Obtiene un registro por ID"""
        try:
            entity = self.repository.get_by_id(id)
            if not entity:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"{self.model_name} no encontrado"
                )
            return self._to_response_schema(entity)
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ Error al obtener {self.model_name} con ID {id}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error interno del servidor al obtener {self.model_name}"
            )
    
    def create(self, data: CreateSchemaType) -> ResponseSchemaType:
        """Crea un nuevo registro"""
        try:
            # Validar y preparar datos
            validated_data = self._validate_create_data(data)
            
            # Crear entidad
            entity = self.repository.create(validated_data)
            
            logger.info(f"✅ {self.model_name} creado exitosamente - ID: {entity.id}")
            return self._to_response_schema(entity)
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ Error al crear {self.model_name}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error interno del servidor al crear {self.model_name}"
            )
    
    def update(self, id: int, data: UpdateSchemaType) -> ResponseSchemaType:
        """Actualiza un registro existente"""
        try:
            # Verificar que existe
            existing = self.repository.get_by_id(id)
            if not existing:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"{self.model_name} no encontrado"
                )
            
            # Validar y preparar datos
            validated_data = self._validate_update_data(id, data)
            
            # Actualizar entidad
            entity = self.repository.update(id, validated_data)
            
            logger.info(f"✅ {self.model_name} actualizado exitosamente - ID: {id}")
            return self._to_response_schema(entity)
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ Error al actualizar {self.model_name} con ID {id}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error interno del servidor al actualizar {self.model_name}"
            )
    
    def delete(self, id: int) -> Dict[str, str]:
        """Elimina un registro (soft delete por defecto)"""
        try:
            # Verificar que existe
            existing = self.repository.get_by_id(id)
            if not existing:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"{self.model_name} no encontrado"
                )
            
            # Eliminar (soft delete)
            self.repository.soft_delete(id)
            
            logger.info(f"✅ {self.model_name} eliminado exitosamente - ID: {id}")
            return {"message": f"{self.model_name} eliminado exitosamente"}
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ Error al eliminar {self.model_name} con ID {id}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error interno del servidor al eliminar {self.model_name}"
            )
# Servicio del módulo User Shift
import logging
from typing import Dict, Any, List
from fastapi import HTTPException, status

from app.shared.base_service import BaseService
from app.modules.user_shift.models import (
    UserShift,
    UserShiftCreateSchema,
    UserShiftUpdateSchema,
    UserShiftSchema,
)
from app.modules.user_shift.repository import UserShiftRepository

logger = logging.getLogger(__name__)


class UserShiftService(BaseService[UserShift, UserShiftCreateSchema, UserShiftUpdateSchema, UserShiftSchema]):
    def __init__(self):
        self.repository = UserShiftRepository()
        super().__init__(self.repository)

    def _validate_create_data(self, data: UserShiftCreateSchema) -> Dict[str, Any]:
        return data.dict()

    def _validate_update_data(self, id: int, data: UserShiftUpdateSchema) -> Dict[str, Any]:
        return {k: v for k, v in data.dict().items() if v is not None}

    def _to_response_schema(self, entity: UserShift) -> UserShiftSchema:
        return UserShiftSchema.from_orm(entity)

    def get_by_user(self, user_id: int) -> List[UserShiftSchema]:
        try:
            items = self.repository.get_by_user(user_id)
            return [self._to_response_schema(it) for it in items]
        except Exception as e:
            logger.error(f"Error al obtener user_shift por usuario {user_id}: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")

    def get_by_shift(self, shift_id: int) -> List[UserShiftSchema]:
        try:
            items = self.repository.get_by_shift(shift_id)
            return [self._to_response_schema(it) for it in items]
        except Exception as e:
            logger.error(f"Error al obtener user_shift por turno {shift_id}: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor")

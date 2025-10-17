# Repositorio del módulo Shift
from app.shared.base_repository import BaseRepository
from app.modules.shift.models import Shift


class ShiftRepository(BaseRepository[Shift]):
    def __init__(self):
        super().__init__(Shift)

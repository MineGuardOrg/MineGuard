from pydantic import BaseModel
from datetime import datetime


class BackupResponse(BaseModel):
    """Respuesta del endpoint de backup"""
    success: bool
    message: str
    backup_file: str
    backup_date: datetime
    file_size_mb: float

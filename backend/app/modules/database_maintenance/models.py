from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class BackupResponse(BaseModel):
    """Respuesta del endpoint de backup"""
    success: bool
    message: str
    backup_file: str
    backup_date: datetime
    file_size_mb: float


class SchemaBackupResponse(BaseModel):
    """Respuesta del endpoint de backup de schema"""
    success: bool
    message: str
    backup_file: str
    backup_date: datetime
    file_size_mb: float
    tables_count: int


class CSVBackupResponse(BaseModel):
    """Respuesta del endpoint de backup CSV"""
    success: bool
    message: str
    backup_file: str
    backup_date: datetime
    file_size_mb: float
    tables_count: int
    total_rows: int

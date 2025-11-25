from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from app.modules.database_maintenance.service import DatabaseMaintenanceService
from app.modules.database_maintenance.models import BackupResponse, CSVBackupResponse
from app.modules.auth.service import AuthService
from app.core.security import get_current_user
from app.shared.exceptions import DatabaseError

database_maintenance_router = APIRouter()
auth_service = AuthService()


@database_maintenance_router.post("/backup")
async def create_database_backup(
    current_user: dict = Depends(get_current_user)
):
    """
    Crea un backup completo de la base de datos MySQL y lo descarga automáticamente.
    
    El backup incluye:
    - Todos los datos de todas las tablas
    - Estructura de las tablas
    - Stored procedures y functions
    - Triggers
    - Eventos programados
    - Soporte completo para caracteres especiales (UTF-8)
    
    El archivo se guarda en backend/sql y se descarga automáticamente con formato: backup_YYYYMMDD.sql
    
    **Requiere autenticación**
    """
    try:
        # Verificar que el usuario tenga permisos (opcional: agregar validación de rol)
        # Por seguridad, podrías validar que solo administradores puedan hacer backups
        # if current_user.get("role") != "admin":
        #     raise HTTPException(status_code=403, detail="No autorizado para crear backups")
        
        service = DatabaseMaintenanceService()
        result = service.create_backup()
        
        # Obtener la ruta completa del archivo
        backup_dir = Path(__file__).resolve().parents[3] / "sql"
        backup_path = backup_dir / result["backup_file"]
        
        # Retornar el archivo para descarga
        return FileResponse(
            path=str(backup_path),
            filename=result["backup_file"],
            media_type="application/sql",
            headers={
                "Content-Disposition": f"attachment; filename={result['backup_file']}"
            }
        )
        
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


@database_maintenance_router.post("/backup-csv")
async def create_csv_backup(
    current_user: dict = Depends(get_current_user)
):
    """
    Crea un backup de la base de datos en formato CSV (un archivo por tabla) y lo descarga como ZIP.
    
    El backup incluye:
    - Un archivo CSV por cada tabla de la base de datos
    - Encabezados con nombres de columnas
    - Todos los datos preservando caracteres especiales (UTF-8 con BOM)
    - Compatible con Excel y otras hojas de cálculo
    - Archivo README.txt con información del backup
    
    El archivo se guarda en backend/sql y se descarga automáticamente con formato: backup_csv_YYYYMMDD.zip
    
    **Requiere autenticación**
    """
    try:
        service = DatabaseMaintenanceService()
        result = service.create_csv_backup()
        
        # Obtener la ruta completa del archivo ZIP
        backup_dir = Path(__file__).resolve().parents[3] / "sql"
        backup_path = backup_dir / result["backup_file"]
        
        # Retornar el archivo ZIP para descarga
        return FileResponse(
            path=str(backup_path),
            filename=result["backup_file"],
            media_type="application/zip",
            headers={
                "Content-Disposition": f"attachment; filename={result['backup_file']}"
            }
        )
        
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


@database_maintenance_router.get("/health")
async def health_check():
    """
    Endpoint de salud para verificar que el módulo está funcionando.
    No requiere autenticación.
    """
    return {
        "status": "healthy",
        "module": "database_maintenance"
    }

from fastapi import APIRouter, Depends, HTTPException
from app.modules.database_maintenance.service import DatabaseMaintenanceService
from app.modules.database_maintenance.models import BackupResponse
from app.modules.auth.service import AuthService
from app.core.security import get_current_user
from app.shared.exceptions import DatabaseError

database_maintenance_router = APIRouter()
auth_service = AuthService()


@database_maintenance_router.post("/backup", response_model=BackupResponse)
async def create_database_backup(
    current_user: dict = Depends(get_current_user)
):
    """
    Crea un backup completo de la base de datos MySQL.
    
    El backup incluye:
    - Todos los datos de todas las tablas
    - Estructura de las tablas
    - Stored procedures y functions
    - Triggers
    - Eventos programados
    - Soporte completo para caracteres especiales (UTF-8)
    
    El archivo se guarda en backend/sql con formato: backup_YYYYMMDD_HHMMSS.sql
    
    **Requiere autenticación**
    """
    try:
        # Verificar que el usuario tenga permisos (opcional: agregar validación de rol)
        # Por seguridad, podrías validar que solo administradores puedan hacer backups
        # if current_user.get("role") != "admin":
        #     raise HTTPException(status_code=403, detail="No autorizado para crear backups")
        
        service = DatabaseMaintenanceService()
        result = service.create_backup()
        
        return BackupResponse(**result)
        
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

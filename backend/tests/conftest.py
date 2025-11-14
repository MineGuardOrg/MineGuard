"""
Configuración global para pytest - Versión Simplificada
Evita conflictos de importación de SQLAlchemy
"""
import pytest
import os
import sys
from pathlib import Path
from fastapi.testclient import TestClient
from dotenv import load_dotenv

# Agregar el directorio raíz al path para imports
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Cargar variables de entorno de testing
test_env_path = project_root / ".env.test"
if test_env_path.exists():
    load_dotenv(dotenv_path=test_env_path, override=True)

# Configurar variables de entorno para testing
os.environ["TESTING"] = "true"
os.environ["ENV"] = "testing"


@pytest.fixture(scope="session")
def client():
    """Cliente de prueba para FastAPI"""
    try:
        # Importar solo cuando sea necesario
        from app.main import app
        
        with TestClient(app) as test_client:
            yield test_client
    except ImportError as e:
        pytest.skip(f"No se pudo importar la aplicación: {e}")


@pytest.fixture(scope="function") 
def sample_user_data():
    """Datos de usuario de ejemplo para pruebas"""
    return {
        "employee_number": "TEST001",
        "email": "test.auth@mineguard.com", 
        "password": "TestPassword123!",
        "first_name": "Test",
        "last_name": "Auth",
        "phone": "1234567890",
        "role_id": 1
    }


@pytest.fixture(scope="function")
def sample_login_data():
    """Datos de login de ejemplo para pruebas"""
    return {
        "employee_number": "TEST001",
        "password": "TestPassword123!"
    }


# Configuración adicional de pytest
pytest_plugins = []
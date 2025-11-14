"""
Pruebas de Integración - Módulo Auth
Pruebas esenciales de autenticación con base de datos real MySQL
"""
import pytest
from fastapi.testclient import TestClient
import time
import random


@pytest.mark.auth
class TestAuthRegister:
    """Pruebas del endpoint de registro de usuarios"""

    def test_register_user_success(self, client: TestClient):
        """Test: Registro exitoso de un nuevo usuario"""
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"EMP{random_id}",
            "first_name": "Juan",
            "last_name": "Pérez",
            "email": f"juan{random_id}@test.com",
            "password": "SecurePass123"
        }
        
        response = client.post("/auth/register", json=user_data)
        
        assert response.status_code in [200, 201]
        data = response.json()
        assert "id" in data
        assert data["employee_number"] == user_data["employee_number"]
        assert data["email"] == user_data["email"]
        assert "password" not in data
        assert data["is_active"] == True

    def test_register_user_duplicate_email(self, client: TestClient):
        """Test: No permitir registro con email duplicado"""
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"EMP{random_id}",
            "first_name": "Test",
            "last_name": "Duplicate",
            "email": f"dup{random_id}@test.com",
            "password": "SecurePass123"
        }
        
        # Primer registro
        first_response = client.post("/auth/register", json=user_data)
        assert first_response.status_code in [200, 201]
        
        # Intentar registrar con diferente employee_number pero mismo email
        user_data["employee_number"] = f"EMP2{random_id}"
        second_response = client.post("/auth/register", json=user_data)
        
        assert second_response.status_code in [409, 500]

    def test_register_user_invalid_data(self, client: TestClient):
        """Test: Validación de datos inválidos (email sin @ y password corta)"""
        random_id = random.randint(10000, 99999)
        
        # Email inválido
        user_data = {
            "employee_number": f"EMP{random_id}",
            "first_name": "Test",
            "last_name": "Invalid",
            "email": "invalid-email-format",
            "password": "SecurePass123"
        }
        response = client.post("/auth/register", json=user_data)
        assert response.status_code == 422
        
        # Password muy corta
        user_data["email"] = f"test{random_id}@test.com"
        user_data["password"] = "123"
        response = client.post("/auth/register", json=user_data)
        assert response.status_code == 422


@pytest.mark.auth
class TestAuthLogin:
    """Pruebas del endpoint de login"""

    def test_login_success(self, client: TestClient):
        """Test: Login exitoso con credenciales válidas"""
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"LOG{random_id}",
            "first_name": "Login",
            "last_name": "Test",
            "email": f"log{random_id}@test.com",
            "password": "SecurePass123"
        }
        
        register_response = client.post("/auth/register", json=user_data)
        assert register_response.status_code in [200, 201]
        
        # Login
        login_data = {
            "employee_number": f"LOG{random_id}",
            "password": "SecurePass123"
        }
        response = client.post("/auth/login", json=login_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data
        assert data["token_type"] == "bearer"
        assert "role" in data

    def test_login_wrong_credentials(self, client: TestClient):
        """Test: Login con credenciales incorrectas"""
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"WRG{random_id}",
            "first_name": "Login",
            "last_name": "Test",
            "email": f"wrg{random_id}@test.com",
            "password": "SecurePass123"
        }
        
        register_response = client.post("/auth/register", json=user_data)
        assert register_response.status_code in [200, 201]
        
        # Login con password incorrecta
        login_data = {
            "employee_number": f"WRG{random_id}",
            "password": "WrongPassword123"
        }
        response = client.post("/auth/login", json=login_data)
        assert response.status_code in [401, 403]


@pytest.mark.auth
class TestAuthMe:
    """Pruebas del endpoint /auth/me (usuario autenticado)"""

    def test_get_current_user_with_token(self, client: TestClient):
        """Test: Obtener información del usuario autenticado con token válido"""
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"ME{random_id}",
            "first_name": "CurrentUser",
            "last_name": "Test",
            "email": f"me{random_id}@test.com",
            "password": "SecurePass123"
        }
        
        register_response = client.post("/auth/register", json=user_data)
        assert register_response.status_code in [200, 201]
        
        # Login para obtener token
        login_data = {
            "employee_number": f"ME{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        
        # Obtener información del usuario
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/auth/me", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["employee_number"] == f"ME{random_id}"
        assert data["email"] == f"me{random_id}@test.com"
        assert "password" not in data

    def test_get_current_user_without_token(self, client: TestClient):
        """Test: Acceder a /auth/me sin token debe fallar"""
        response = client.get("/auth/me")
        assert response.status_code in [401, 403]


@pytest.mark.auth
class TestAuthIntegration:
    """Pruebas de integración del flujo completo de autenticación"""

    def test_complete_auth_flow(self, client: TestClient):
        """Test: Flujo completo - Registro → Login → Obtener info usuario"""
        random_id = random.randint(10000, 99999)
        
        # 1. Registro
        user_data = {
            "employee_number": f"FLW{random_id}",
            "first_name": "Flow",
            "last_name": "Test",
            "email": f"flw{random_id}@test.com",
            "password": "SecurePass123"
        }
        register_response = client.post("/auth/register", json=user_data)
        assert register_response.status_code in [200, 201]
        user_id = register_response.json()["id"]
        
        # 2. Login
        login_data = {
            "employee_number": f"FLW{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        assert login_response.status_code == 200
        token = login_response.json()["access_token"]
        
        # 3. Obtener información del usuario autenticado
        headers = {"Authorization": f"Bearer {token}"}
        me_response = client.get("/auth/me", headers=headers)
        assert me_response.status_code == 200
        
        current_user = me_response.json()
        assert current_user["id"] == user_id
        assert current_user["employee_number"] == f"FLW{random_id}"
        assert current_user["email"] == f"flw{random_id}@test.com"

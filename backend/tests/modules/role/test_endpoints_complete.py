"""
Pruebas de Integración - Módulo Role
Pruebas esenciales de roles con base de datos real MySQL
"""
import pytest
from fastapi.testclient import TestClient
import random


@pytest.mark.role
class TestRoleCRUD:
    """Pruebas CRUD del módulo Role"""

    def test_create_role_success(self, client: TestClient):
        """Test: Crear rol exitosamente"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"ROL{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"rol{random_id}@test.com",
            "password": "SecurePass123"
        }
        client.post("/auth/register", json=user_data)
        
        login_data = {
            "employee_number": f"ROL{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear rol
        role_data = {
            "name": f"Role{random_id}",
            "description": "Rol de prueba"
        }
        response = client.post("/roles/", json=role_data, headers=headers)
        
        assert response.status_code == 201
        data = response.json()
        assert "id" in data
        assert data["name"] == role_data["name"]
        assert data["description"] == role_data["description"]
        assert data["is_active"] == True

    def test_create_role_without_auth(self, client: TestClient):
        """Test: Crear rol sin autenticación debe fallar"""
        role_data = {
            "name": "Role Sin Auth",
            "description": "No debe crearse"
        }
        response = client.post("/roles/", json=role_data)
        
        assert response.status_code in [401, 403]

    def test_get_all_roles(self, client: TestClient):
        """Test: Obtener todos los roles"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"ROL{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"rol{random_id}@test.com",
            "password": "SecurePass123"
        }
        client.post("/auth/register", json=user_data)
        
        login_data = {
            "employee_number": f"ROL{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Obtener todos los roles
        response = client.get("/roles/", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_get_role_by_id(self, client: TestClient):
        """Test: Obtener rol por ID"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"ROL{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"rol{random_id}@test.com",
            "password": "SecurePass123"
        }
        client.post("/auth/register", json=user_data)
        
        login_data = {
            "employee_number": f"ROL{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear rol
        role_data = {
            "name": f"GetById{random_id}",
            "description": "Para obtener por ID"
        }
        create_response = client.post("/roles/", json=role_data, headers=headers)
        role_id = create_response.json()["id"]
        
        # Obtener por ID
        response = client.get(f"/roles/{role_id}", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == role_id
        assert data["name"] == role_data["name"]

    def test_update_role(self, client: TestClient):
        """Test: Actualizar rol existente"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"ROL{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"rol{random_id}@test.com",
            "password": "SecurePass123"
        }
        client.post("/auth/register", json=user_data)
        
        login_data = {
            "employee_number": f"ROL{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear rol
        role_data = {
            "name": f"Original{random_id}",
            "description": "Descripción original"
        }
        create_response = client.post("/roles/", json=role_data, headers=headers)
        role_id = create_response.json()["id"]
        
        # Actualizar rol
        update_data = {
            "name": f"Updated{random_id}",
            "description": "Descripción actualizada"
        }
        response = client.put(f"/roles/{role_id}", json=update_data, headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == update_data["name"]
        assert data["description"] == update_data["description"]

    def test_delete_role(self, client: TestClient):
        """Test: Eliminar rol (soft delete)"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"ROL{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"rol{random_id}@test.com",
            "password": "SecurePass123"
        }
        client.post("/auth/register", json=user_data)
        
        login_data = {
            "employee_number": f"ROL{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear rol
        role_data = {
            "name": f"Delete{random_id}",
            "description": "Para eliminar"
        }
        create_response = client.post("/roles/", json=role_data, headers=headers)
        role_id = create_response.json()["id"]
        
        # Eliminar rol
        response = client.delete(f"/roles/{role_id}", headers=headers)
        
        assert response.status_code == 200


@pytest.mark.role
class TestRoleValidation:
    """Pruebas de validación del módulo Role"""

    def test_create_role_missing_name(self, client: TestClient):
        """Test: Crear rol sin nombre debe fallar"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"ROL{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"rol{random_id}@test.com",
            "password": "SecurePass123"
        }
        client.post("/auth/register", json=user_data)
        
        login_data = {
            "employee_number": f"ROL{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Intentar crear sin nombre
        role_data = {
            "description": "Sin nombre"
        }
        response = client.post("/roles/", json=role_data, headers=headers)
        
        assert response.status_code == 422

    def test_get_nonexistent_role(self, client: TestClient):
        """Test: Obtener rol inexistente debe fallar"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"ROL{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"rol{random_id}@test.com",
            "password": "SecurePass123"
        }
        client.post("/auth/register", json=user_data)
        
        login_data = {
            "employee_number": f"ROL{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Intentar obtener rol inexistente
        response = client.get("/roles/999999", headers=headers)
        
        assert response.status_code == 404

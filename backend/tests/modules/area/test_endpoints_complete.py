"""
Pruebas de Integración - Módulo Area
Pruebas esenciales de áreas con base de datos real MySQL
"""
import pytest
from fastapi.testclient import TestClient
import random


@pytest.mark.area
class TestAreaCRUD:
    """Pruebas CRUD del módulo Area"""

    def test_create_area_success(self, client: TestClient):
        """Test: Crear área exitosamente"""
        # Primero hacer login para obtener token
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"USR{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"usr{random_id}@test.com",
            "password": "SecurePass123"
        }
        client.post("/auth/register", json=user_data)
        
        login_data = {
            "employee_number": f"USR{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear área
        area_data = {
            "name": f"Area Test {random_id}",
            "description": "Área de prueba"
        }
        response = client.post("/areas/", json=area_data, headers=headers)
        
        assert response.status_code == 201
        data = response.json()
        assert "id" in data
        assert data["name"] == area_data["name"]
        assert data["description"] == area_data["description"]
        assert data["is_active"] == True

    def test_create_area_without_auth(self, client: TestClient):
        """Test: Crear área sin autenticación debe fallar"""
        area_data = {
            "name": "Area Sin Auth",
            "description": "No debe crearse"
        }
        response = client.post("/areas/", json=area_data)
        
        assert response.status_code in [401, 403]

    def test_get_all_areas(self, client: TestClient):
        """Test: Obtener todas las áreas"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"USR{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"usr{random_id}@test.com",
            "password": "SecurePass123"
        }
        client.post("/auth/register", json=user_data)
        
        login_data = {
            "employee_number": f"USR{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear un área
        area_data = {
            "name": f"Area List {random_id}",
            "description": "Para listar"
        }
        client.post("/areas/", json=area_data, headers=headers)
        
        # Obtener todas las áreas
        response = client.get("/areas/", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_get_area_by_id(self, client: TestClient):
        """Test: Obtener área por ID"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"USR{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"usr{random_id}@test.com",
            "password": "SecurePass123"
        }
        client.post("/auth/register", json=user_data)
        
        login_data = {
            "employee_number": f"USR{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear área
        area_data = {
            "name": f"Area GetById {random_id}",
            "description": "Para obtener por ID"
        }
        create_response = client.post("/areas/", json=area_data, headers=headers)
        area_id = create_response.json()["id"]
        
        # Obtener por ID
        response = client.get(f"/areas/{area_id}", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == area_id
        assert data["name"] == area_data["name"]

    def test_update_area(self, client: TestClient):
        """Test: Actualizar área existente"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"USR{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"usr{random_id}@test.com",
            "password": "SecurePass123"
        }
        client.post("/auth/register", json=user_data)
        
        login_data = {
            "employee_number": f"USR{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear área
        area_data = {
            "name": f"Area Original {random_id}",
            "description": "Descripción original"
        }
        create_response = client.post("/areas/", json=area_data, headers=headers)
        area_id = create_response.json()["id"]
        
        # Actualizar área
        update_data = {
            "name": f"Area Actualizada {random_id}",
            "description": "Descripción actualizada"
        }
        response = client.put(f"/areas/{area_id}", json=update_data, headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == update_data["name"]
        assert data["description"] == update_data["description"]

    def test_delete_area(self, client: TestClient):
        """Test: Eliminar área (soft delete)"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"USR{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"usr{random_id}@test.com",
            "password": "SecurePass123"
        }
        client.post("/auth/register", json=user_data)
        
        login_data = {
            "employee_number": f"USR{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear área
        area_data = {
            "name": f"Area Delete {random_id}",
            "description": "Para eliminar"
        }
        create_response = client.post("/areas/", json=area_data, headers=headers)
        area_id = create_response.json()["id"]
        
        # Eliminar área
        response = client.delete(f"/areas/{area_id}", headers=headers)
        
        assert response.status_code == 200


@pytest.mark.area
class TestAreaValidation:
    """Pruebas de validación del módulo Area"""

    def test_create_area_missing_name(self, client: TestClient):
        """Test: Crear área sin nombre debe fallar"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"USR{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"usr{random_id}@test.com",
            "password": "SecurePass123"
        }
        client.post("/auth/register", json=user_data)
        
        login_data = {
            "employee_number": f"USR{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Intentar crear sin nombre
        area_data = {
            "description": "Sin nombre"
        }
        response = client.post("/areas/", json=area_data, headers=headers)
        
        assert response.status_code == 422

    def test_get_nonexistent_area(self, client: TestClient):
        """Test: Obtener área inexistente debe fallar"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"USR{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"usr{random_id}@test.com",
            "password": "SecurePass123"
        }
        client.post("/auth/register", json=user_data)
        
        login_data = {
            "employee_number": f"USR{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Intentar obtener área inexistente
        response = client.get("/areas/999999", headers=headers)
        
        assert response.status_code == 404

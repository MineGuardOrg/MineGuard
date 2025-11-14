"""
Pruebas de Integración - Módulo Device
Pruebas esenciales de dispositivos con base de datos real MySQL
"""
import pytest
from fastapi.testclient import TestClient
import random


@pytest.mark.device
class TestDeviceCRUD:
    """Pruebas CRUD del módulo Device"""

    def test_create_device_success(self, client: TestClient):
        """Test: Crear dispositivo exitosamente"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"DEV{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"dev{random_id}@test.com",
            "password": "SecurePass123"
        }
        register_response = client.post("/auth/register", json=user_data)
        user_id = register_response.json()["id"]
        
        login_data = {
            "employee_number": f"DEV{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear dispositivo
        device_data = {
            "model": f"Samsung Galaxy S{random_id}",
            "user_id": user_id
        }
        response = client.post("/devices/", json=device_data, headers=headers)
        
        assert response.status_code == 201
        data = response.json()
        assert "id" in data
        assert data["model"] == device_data["model"]
        assert data["user_id"] == user_id
        assert data["is_active"] == True

    def test_create_device_without_auth(self, client: TestClient):
        """Test: Crear dispositivo sin autenticación debe fallar"""
        device_data = {
            "model": "Device Sin Auth",
            "user_id": 1
        }
        response = client.post("/devices/", json=device_data)
        
        assert response.status_code in [401, 403]

    def test_get_all_devices(self, client: TestClient):
        """Test: Obtener todos los dispositivos"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"DEV{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"dev{random_id}@test.com",
            "password": "SecurePass123"
        }
        register_response = client.post("/auth/register", json=user_data)
        user_id = register_response.json()["id"]
        
        login_data = {
            "employee_number": f"DEV{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear un dispositivo
        device_data = {
            "model": f"Device List {random_id}",
            "user_id": user_id
        }
        client.post("/devices/", json=device_data, headers=headers)
        
        # Obtener todos los dispositivos
        response = client.get("/devices/", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_get_device_by_id(self, client: TestClient):
        """Test: Obtener dispositivo por ID"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"DEV{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"dev{random_id}@test.com",
            "password": "SecurePass123"
        }
        register_response = client.post("/auth/register", json=user_data)
        user_id = register_response.json()["id"]
        
        login_data = {
            "employee_number": f"DEV{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear dispositivo
        device_data = {
            "model": f"Device GetById {random_id}",
            "user_id": user_id
        }
        create_response = client.post("/devices/", json=device_data, headers=headers)
        device_id = create_response.json()["id"]
        
        # Obtener por ID
        response = client.get(f"/devices/{device_id}", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == device_id
        assert data["model"] == device_data["model"]

    def test_update_device(self, client: TestClient):
        """Test: Actualizar dispositivo existente"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"DEV{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"dev{random_id}@test.com",
            "password": "SecurePass123"
        }
        register_response = client.post("/auth/register", json=user_data)
        user_id = register_response.json()["id"]
        
        login_data = {
            "employee_number": f"DEV{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear dispositivo
        device_data = {
            "model": f"Device Original {random_id}",
            "user_id": user_id
        }
        create_response = client.post("/devices/", json=device_data, headers=headers)
        device_id = create_response.json()["id"]
        
        # Actualizar dispositivo
        update_data = {
            "model": f"Device Actualizado {random_id}"
        }
        response = client.put(f"/devices/{device_id}", json=update_data, headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["model"] == update_data["model"]

    def test_delete_device(self, client: TestClient):
        """Test: Eliminar dispositivo (soft delete)"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"DEV{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"dev{random_id}@test.com",
            "password": "SecurePass123"
        }
        register_response = client.post("/auth/register", json=user_data)
        user_id = register_response.json()["id"]
        
        login_data = {
            "employee_number": f"DEV{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear dispositivo
        device_data = {
            "model": f"Device Delete {random_id}",
            "user_id": user_id
        }
        create_response = client.post("/devices/", json=device_data, headers=headers)
        device_id = create_response.json()["id"]
        
        # Eliminar dispositivo
        response = client.delete(f"/devices/{device_id}", headers=headers)
        
        assert response.status_code == 200

    def test_get_devices_by_user(self, client: TestClient):
        """Test: Obtener dispositivos por usuario"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"DEV{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"dev{random_id}@test.com",
            "password": "SecurePass123"
        }
        register_response = client.post("/auth/register", json=user_data)
        user_id = register_response.json()["id"]
        
        login_data = {
            "employee_number": f"DEV{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Crear dispositivo para el usuario
        device_data = {
            "model": f"Device User {random_id}",
            "user_id": user_id
        }
        client.post("/devices/", json=device_data, headers=headers)
        
        # Obtener dispositivos del usuario
        response = client.get(f"/devices/by-user/{user_id}", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert all(device["user_id"] == user_id for device in data)


@pytest.mark.device
class TestDeviceValidation:
    """Pruebas de validación del módulo Device"""

    def test_create_device_missing_model(self, client: TestClient):
        """Test: Crear dispositivo sin modelo debe fallar"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"DEV{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"dev{random_id}@test.com",
            "password": "SecurePass123"
        }
        register_response = client.post("/auth/register", json=user_data)
        user_id = register_response.json()["id"]
        
        login_data = {
            "employee_number": f"DEV{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Intentar crear sin modelo
        device_data = {
            "user_id": user_id
        }
        response = client.post("/devices/", json=device_data, headers=headers)
        
        assert response.status_code == 422

    def test_get_nonexistent_device(self, client: TestClient):
        """Test: Obtener dispositivo inexistente debe fallar"""
        # Login
        random_id = random.randint(10000, 99999)
        user_data = {
            "employee_number": f"DEV{random_id}",
            "first_name": "Test",
            "last_name": "User",
            "email": f"dev{random_id}@test.com",
            "password": "SecurePass123"
        }
        client.post("/auth/register", json=user_data)
        
        login_data = {
            "employee_number": f"DEV{random_id}",
            "password": "SecurePass123"
        }
        login_response = client.post("/auth/login", json=login_data)
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Intentar obtener dispositivo inexistente
        response = client.get("/devices/999999", headers=headers)
        
        assert response.status_code == 404

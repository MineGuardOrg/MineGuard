"""
Tests de integración completos para el módulo Reading.
Incluye pruebas de CRUD, validación y endpoints by-sensor/by-user.
"""

import pytest
import random
from fastapi.testclient import TestClient


@pytest.mark.reading
def test_create_reading_success(client: TestClient):
    """Prueba crear un reading exitosamente con sensor_id=1"""
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Obtener user_id del usuario actual
    response = client.get("/auth/me", headers=headers)
    user_id = response.json()["id"]
    
    # Crear reading
    reading_data = {
        "value": 42.5,
        "sensor_id": 1,
        "user_id": user_id
    }
    response = client.post("/readings/", json=reading_data, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["value"] == reading_data["value"]
    assert data["sensor_id"] == 1
    assert data["user_id"] == user_id
    assert "id" in data


@pytest.mark.reading
def test_create_reading_without_auth(client: TestClient):
    """Prueba crear reading sin autenticación debe fallar"""
    reading_data = {
        "value": 50.0,
        "sensor_id": 1,
        "user_id": 1
    }
    response = client.post("/readings/", json=reading_data)
    assert response.status_code == 403


@pytest.mark.reading
def test_get_all_readings(client: TestClient):
    """Prueba obtener todos los readings"""
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/readings/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.reading
def test_get_reading_by_id(client: TestClient):
    """Prueba obtener reading por ID"""
    random_id = random.randint(10000, 99999)
    
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Obtener user_id del usuario actual
    response = client.get("/auth/me", headers=headers)
    user_id = response.json()["id"]
    
    # Crear reading
    reading_data = {
        "value": 75.0,
        "sensor_id": 1,
        "user_id": user_id
    }
    response = client.post("/readings/", json=reading_data, headers=headers)
    reading_id = response.json()["id"]
    
    # Obtener por ID
    response = client.get(f"/readings/{reading_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == reading_id
    assert data["value"] == reading_data["value"]


@pytest.mark.reading
def test_get_readings_by_sensor(client: TestClient):
    """Prueba obtener readings por sensor_id"""
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/readings/by-sensor/1", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.reading
def test_get_readings_by_user(client: TestClient):
    """Prueba obtener readings por user_id"""
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Obtener user_id del usuario actual
    response = client.get("/auth/me", headers=headers)
    user_id = response.json()["id"]
    
    response = client.get(f"/readings/by-user/{user_id}", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.reading
def test_update_reading(client: TestClient):
    """Prueba actualizar un reading"""
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Obtener user_id del usuario actual
    response = client.get("/auth/me", headers=headers)
    user_id = response.json()["id"]
    
    # Crear reading
    reading_data = {
        "value": 50.0,
        "sensor_id": 1,
        "user_id": user_id
    }
    response = client.post("/readings/", json=reading_data, headers=headers)
    reading_id = response.json()["id"]
    
    # Actualizar
    update_data = {"value": 75.5}
    response = client.put(f"/readings/{reading_id}", json=update_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["value"] == update_data["value"]
    assert data["id"] == reading_id


@pytest.mark.reading
def test_delete_reading(client: TestClient):
    """Prueba eliminar un reading"""
    random_id = random.randint(10000, 99999)
    
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Obtener user_id del usuario actual
    response = client.get("/auth/me", headers=headers)
    user_id = response.json()["id"]
    
    # Crear reading
    reading_data = {
        "value": 100.0,
        "sensor_id": 1,
        "user_id": user_id
    }
    response = client.post("/readings/", json=reading_data, headers=headers)
    reading_id = response.json()["id"]
    
    # Eliminar
    response = client.delete(f"/readings/{reading_id}", headers=headers)
    assert response.status_code == 200
    
    # Verificar eliminación
    response = client.get(f"/readings/{reading_id}", headers=headers)
    assert response.status_code == 404

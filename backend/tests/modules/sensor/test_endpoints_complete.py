"""
Tests de integración completos para el módulo Sensor.
Incluye pruebas de CRUD, validación y endpoint by-device.
"""

import pytest
import random
from fastapi.testclient import TestClient


@pytest.mark.sensor
def test_create_sensor_success(client: TestClient):
    """Prueba crear un sensor exitosamente con device existente"""
    random_id = random.randint(10000, 99999)
    
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Primero crear un device para poder asociar el sensor
    device_data = {
        "serial_number": f"DEV-{random_id}",
        "model": "Test Model",
        "manufacturer": "Test Manufacturer",
        "user_id": response.json().get("user_id") or 1
    }
    device_response = client.post("/devices/", json=device_data, headers=headers)
    
    # Si no se puede crear device, usar el primero disponible
    if device_response.status_code != 201:
        devices_response = client.get("/devices/", headers=headers)
        if devices_response.json():
            device_id = devices_response.json()[0]["id"]
        else:
            pytest.skip("No hay devices disponibles para probar")
    else:
        device_id = device_response.json()["id"]
    
    # Crear sensor
    sensor_data = {
        "name": f"Sensor Test {random_id}",
        "description": f"Test sensor description {random_id}",
        "unit": "ppm",
        "type": "gas",
        "device_id": device_id
    }
    response = client.post("/sensors/", json=sensor_data, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == sensor_data["name"]
    assert data["unit"] == sensor_data["unit"]
    assert data["type"] == sensor_data["type"]
    assert data["device_id"] == device_id
    assert "id" in data


@pytest.mark.sensor
def test_create_sensor_without_auth(client: TestClient):
    """Prueba crear sensor sin autenticación debe fallar"""
    sensor_data = {
        "name": "Unauthorized Sensor",
        "description": "Should fail",
        "unit": "ppm",
        "type": "gas",
        "device_id": 1
    }
    response = client.post("/sensors/", json=sensor_data)
    assert response.status_code == 403


@pytest.mark.sensor
def test_get_all_sensors(client: TestClient):
    """Prueba obtener todos los sensores"""
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/sensors/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.sensor
def test_get_sensor_by_id(client: TestClient):
    """Prueba obtener sensor por ID"""
    random_id = random.randint(10000, 99999)
    
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Obtener o crear device
    devices_response = client.get("/devices/", headers=headers)
    if devices_response.json():
        device_id = devices_response.json()[0]["id"]
    else:
        pytest.skip("No hay devices disponibles")
    
    # Crear sensor
    sensor_data = {
        "name": f"Sensor ID Test {random_id}",
        "description": "For ID test",
        "unit": "ppm",
        "type": "gas",
        "device_id": device_id
    }
    response = client.post("/sensors/", json=sensor_data, headers=headers)
    sensor_id = response.json()["id"]
    
    # Obtener por ID
    response = client.get(f"/sensors/{sensor_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == sensor_id
    assert data["name"] == sensor_data["name"]


@pytest.mark.sensor
def test_get_sensors_by_device(client: TestClient):
    """Prueba obtener sensores por device_id"""
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Obtener devices disponibles
    devices_response = client.get("/devices/", headers=headers)
    if devices_response.json():
        device_id = devices_response.json()[0]["id"]
        response = client.get(f"/sensors/by-device/{device_id}", headers=headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    else:
        pytest.skip("No hay devices disponibles para probar")


@pytest.mark.sensor
def test_update_sensor(client: TestClient):
    """Prueba actualizar un sensor"""
    random_id = random.randint(10000, 99999)
    
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Obtener device disponible
    devices_response = client.get("/devices/", headers=headers)
    if not devices_response.json():
        pytest.skip("No hay devices disponibles")
    device_id = devices_response.json()[0]["id"]
    
    # Crear sensor
    sensor_data = {
        "name": f"Original Sensor {random_id}",
        "description": "Original description",
        "unit": "ppm",
        "type": "gas",
        "device_id": device_id
    }
    response = client.post("/sensors/", json=sensor_data, headers=headers)
    sensor_id = response.json()["id"]
    
    # Actualizar
    update_data = {"name": f"Updated Sensor {random_id}", "unit": "mg/m3"}
    response = client.put(f"/sensors/{sensor_id}", json=update_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["unit"] == update_data["unit"]


@pytest.mark.sensor
def test_delete_sensor(client: TestClient):
    """Prueba eliminar un sensor"""
    random_id = random.randint(10000, 99999)
    
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Obtener device disponible
    devices_response = client.get("/devices/", headers=headers)
    if not devices_response.json():
        pytest.skip("No hay devices disponibles")
    device_id = devices_response.json()[0]["id"]
    
    # Crear sensor
    sensor_data = {
        "name": f"To Delete {random_id}",
        "description": "Will be deleted",
        "unit": "ppm",
        "type": "gas",
        "device_id": device_id
    }
    response = client.post("/sensors/", json=sensor_data, headers=headers)
    sensor_id = response.json()["id"]
    
    # Eliminar
    response = client.delete(f"/sensors/{sensor_id}", headers=headers)
    assert response.status_code == 200
    
    # Verificar eliminación
    response = client.get(f"/sensors/{sensor_id}", headers=headers)
    assert response.status_code == 404

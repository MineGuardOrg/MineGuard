"""
Tests de integración completos para el módulo Alert.
Incluye pruebas de CRUD, validación y endpoint by-reading.
"""

import pytest
import random
from fastapi.testclient import TestClient


@pytest.mark.alert
def test_create_alert_success(client: TestClient):
    """Prueba crear un alert exitosamente con reading_id válido"""
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Obtener user_id del usuario actual
    response = client.get("/auth/me", headers=headers)
    user_id = response.json()["id"]
    
    # Crear reading primero
    reading_data = {
        "value": 90.5,
        "sensor_id": 1,
        "user_id": user_id
    }
    response = client.post("/readings/", json=reading_data, headers=headers)
    reading_id = response.json()["id"]
    
    # Crear alert
    alert_data = {
        "alert_type": "gas_threshold",
        "severity": "high",
        "reading_id": reading_id
    }
    response = client.post("/alerts/", json=alert_data, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["alert_type"] == alert_data["alert_type"]
    assert data["severity"] == alert_data["severity"]
    assert data["reading_id"] == reading_id
    assert "id" in data


@pytest.mark.alert
def test_create_alert_without_auth(client: TestClient):
    """Prueba crear alert sin autenticación debe fallar"""
    alert_data = {
        "alert_type": "test_alert",
        "severity": "low",
        "reading_id": 1
    }
    response = client.post("/alerts/", json=alert_data)
    assert response.status_code == 403


@pytest.mark.alert
def test_get_all_alerts(client: TestClient):
    """Prueba obtener todos los alerts"""
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/alerts/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.alert
def test_get_alert_by_id(client: TestClient):
    """Prueba obtener alert por ID"""
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Obtener user_id del usuario actual
    response = client.get("/auth/me", headers=headers)
    user_id = response.json()["id"]
    
    # Crear reading
    reading_data = {"value": 85.0, "sensor_id": 1, "user_id": user_id}
    response = client.post("/readings/", json=reading_data, headers=headers)
    reading_id = response.json()["id"]
    
    # Crear alert
    alert_data = {
        "alert_type": "temperature_warning",
        "severity": "medium",
        "reading_id": reading_id
    }
    response = client.post("/alerts/", json=alert_data, headers=headers)
    alert_id = response.json()["id"]
    
    # Obtener por ID
    response = client.get(f"/alerts/{alert_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == alert_id
    assert data["alert_type"] == alert_data["alert_type"]


@pytest.mark.alert
def test_get_alerts_by_reading(client: TestClient):
    """Prueba obtener alerts por reading_id"""
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Obtener user_id del usuario actual
    response = client.get("/auth/me", headers=headers)
    user_id = response.json()["id"]
    
    # Crear reading
    reading_data = {"value": 95.0, "sensor_id": 1, "user_id": user_id}
    response = client.post("/readings/", json=reading_data, headers=headers)
    reading_id = response.json()["id"]
    
    response = client.get(f"/alerts/by-reading/{reading_id}", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.alert
def test_update_alert(client: TestClient):
    """Prueba actualizar un alert"""
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Obtener user_id del usuario actual
    response = client.get("/auth/me", headers=headers)
    user_id = response.json()["id"]
    
    # Crear reading
    reading_data = {"value": 80.0, "sensor_id": 1, "user_id": user_id}
    response = client.post("/readings/", json=reading_data, headers=headers)
    reading_id = response.json()["id"]
    
    # Crear alert
    alert_data = {
        "alert_type": "original_type",
        "severity": "low",
        "reading_id": reading_id
    }
    response = client.post("/alerts/", json=alert_data, headers=headers)
    alert_id = response.json()["id"]
    
    # Actualizar
    update_data = {"severity": "high", "alert_type": "critical_alert"}
    response = client.put(f"/alerts/{alert_id}", json=update_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["severity"] == update_data["severity"]
    assert data["alert_type"] == update_data["alert_type"]


@pytest.mark.alert
def test_delete_alert(client: TestClient):
    """Prueba eliminar un alert"""
    # Login con usuario existente
    login_data = {"employee_number": "0322103782", "password": "123456"}
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Obtener user_id del usuario actual
    response = client.get("/auth/me", headers=headers)
    user_id = response.json()["id"]
    
    # Crear reading
    reading_data = {"value": 70.0, "sensor_id": 1, "user_id": user_id}
    response = client.post("/readings/", json=reading_data, headers=headers)
    reading_id = response.json()["id"]
    
    # Crear alert
    alert_data = {
        "alert_type": "to_delete",
        "severity": "medium",
        "reading_id": reading_id
    }
    response = client.post("/alerts/", json=alert_data, headers=headers)
    alert_id = response.json()["id"]
    
    # Eliminar
    response = client.delete(f"/alerts/{alert_id}", headers=headers)
    assert response.status_code == 200
    
    # Verificar eliminación
    response = client.get(f"/alerts/{alert_id}", headers=headers)
    assert response.status_code == 404

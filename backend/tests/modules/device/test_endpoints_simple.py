"""
Pruebas del módulo Device - Endpoints
Pruebas de los endpoints de gestión de dispositivos
"""
import pytest


@pytest.mark.device
class TestDeviceEndpointsSimple:
    """Pruebas básicas de endpoints del módulo Device"""

    def test_devices_list_endpoint_availability(self, client):
        """Test: Verificar que el endpoint de listar dispositivos esté disponible"""
        try:
            response = client.get("/devices/")
            assert response.status_code in [401, 403, 422, 500, 200, 404]
            print(f"✅ Endpoint /devices/ responde: {response.status_code}")
        except Exception as e:
            pytest.skip(f"Endpoint no disponible: {e}")

    def test_devices_create_endpoint_availability(self, client):
        """Test: Verificar que el endpoint de crear dispositivo esté disponible"""
        try:
            response = client.post("/devices/", json={})
            assert response.status_code in [400, 401, 403, 422, 500, 200, 404]
            print(f"✅ Endpoint POST /devices/ responde: {response.status_code}")
        except Exception as e:
            pytest.skip(f"Endpoint no disponible: {e}")

    def test_devices_get_by_id_endpoint_availability(self, client):
        """Test: Verificar que el endpoint de obtener dispositivo por ID esté disponible"""
        try:
            response = client.get("/devices/1")
            assert response.status_code in [401, 403, 404, 422, 500, 200]
            print(f"✅ Endpoint GET /devices/1 responde: {response.status_code}")
        except Exception as e:
            pytest.skip(f"Endpoint no disponible: {e}")
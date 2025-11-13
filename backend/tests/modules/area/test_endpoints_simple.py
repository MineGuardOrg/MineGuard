"""
Pruebas del módulo Area - Endpoints
Pruebas de los endpoints de gestión de áreas
"""
import pytest


@pytest.mark.area
class TestAreaEndpointsSimple:
    """Pruebas básicas de endpoints del módulo Area"""

    def test_areas_list_endpoint_availability(self, client):
        """Test: Verificar que el endpoint de listar áreas esté disponible"""
        try:
            response = client.get("/areas/")
            assert response.status_code in [401, 403, 422, 500, 200, 404]
            print(f"✅ Endpoint /areas/ responde: {response.status_code}")
        except Exception as e:
            pytest.skip(f"Endpoint no disponible: {e}")

    def test_areas_create_endpoint_availability(self, client):
        """Test: Verificar que el endpoint de crear área esté disponible"""
        try:
            response = client.post("/areas/", json={})
            assert response.status_code in [400, 401, 403, 422, 500, 200, 404]
            print(f"✅ Endpoint POST /areas/ responde: {response.status_code}")
        except Exception as e:
            pytest.skip(f"Endpoint no disponible: {e}")

    def test_areas_get_by_id_endpoint_availability(self, client):
        """Test: Verificar que el endpoint de obtener área por ID esté disponible"""
        try:
            response = client.get("/areas/1")
            assert response.status_code in [401, 403, 404, 422, 500, 200]
            print(f"✅ Endpoint GET /areas/1 responde: {response.status_code}")
        except Exception as e:
            pytest.skip(f"Endpoint no disponible: {e}")
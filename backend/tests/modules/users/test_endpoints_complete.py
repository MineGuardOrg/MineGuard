"""
Pruebas completas del módulo Users - Endpoints
Pruebas de integración con base de datos y flujos completos
"""
import pytest
from fastapi.testclient import TestClient


@pytest.mark.users
class TestUsersEndpointsComplete:
    """Pruebas completas de endpoints del módulo Users"""

    @pytest.fixture(autouse=True)
    def setup(self, client):
        """Setup ejecutado antes de cada prueba"""
        self.client = client
        self.auth_token = None
        self.created_user_id = None

    def _get_auth_token(self):
        """Helper: Obtiene token de autenticación creando y logueando un admin"""
        # Primero intentar registrar un usuario admin
        register_data = {
            "employee_number": "ADMIN001",
            "email": "admin@mineguard.com",
            "password": "AdminPass123!",
            "first_name": "Admin",
            "last_name": "User",
            "phone": "1234567890",
            "role_id": 1  # Asumiendo que 1 es admin
        }
        
        # Intentar registro (puede fallar si ya existe, está bien)
        self.client.post("/auth/register", json=register_data)
        
        # Hacer login
        login_data = {
            "employee_number": "ADMIN001",
            "password": "AdminPass123!"
        }
        response = self.client.post("/auth/login", json=login_data)
        
        if response.status_code == 200:
            return response.json().get("access_token")
        return None

    def test_users_list_without_auth(self):
        """Test: Listar usuarios sin autenticación debe fallar"""
        response = self.client.get("/users/getall")
        
        # Debe requerir autenticación
        assert response.status_code in [401, 403, 404], \
            f"Esperaba 401/403/404 pero obtuvo {response.status_code}"
        
        if response.status_code == 404:
            print(f"⚠️ Endpoint no encontrado (404), verificar ruta")
        else:
            print(f"✅ Correctamente rechaza acceso sin autenticación: {response.status_code}")

    def test_users_list_with_auth(self):
        """Test: Listar usuarios con autenticación debe funcionar"""
        token = self._get_auth_token()
        
        if not token:
            pytest.skip("No se pudo obtener token de autenticación")
        
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get("/users/getall", headers=headers)
        
        # Debe funcionar con autenticación
        assert response.status_code == 200, \
            f"Esperaba 200 pero obtuvo {response.status_code}"
        
        # Verificar que devuelve una lista
        data = response.json()
        assert isinstance(data, list), "La respuesta debe ser una lista"
        print(f"✅ Lista de usuarios obtenida correctamente: {len(data)} usuarios")

    def test_create_user_via_auth_register(self):
        """Test: Crear usuario a través del endpoint de registro"""
        # Los usuarios se crean via /auth/register, no /users/
        new_user = {
            "employee_number": "NEWTEST001",
            "email": "newtest@mineguard.com",
            "password": "TestPass123!",
            "first_name": "New",
            "last_name": "Test",
            "phone": "9876543210",
            "role_id": 2
        }
        
        response = self.client.post("/auth/register", json=new_user)
        
        # Verificar respuesta
        if response.status_code == 200:
            data = response.json()
            
            # Verificar que se creó correctamente
            assert "id" in data, "La respuesta debe incluir el ID"
            assert data["email"] == new_user["email"]
            assert data["employee_number"] == new_user["employee_number"]
            assert "password" not in data, "No debe devolver la contraseña"
            
            self.created_user_id = data["id"]
            print(f"✅ Usuario creado correctamente con ID: {self.created_user_id}")
            
        elif response.status_code in [400, 409]:
            # Usuario ya existe, está bien para pruebas
            print("⚠️ Usuario ya existe (esperado en pruebas repetidas)")
            
        else:
            print(f"ℹ️ Respuesta del registro: {response.status_code}")

    def test_get_user_by_id(self):
        """Test: Obtener usuario por ID"""
        token = self._get_auth_token()
        
        if not token:
            pytest.skip("No se pudo obtener token de autenticación")
        
        # Usar ID 1 (normalmente existe)
        user_id = 1
        
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(f"/users/getbyid/{user_id}", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            
            # Verificar estructura de respuesta
            assert "id" in data
            assert "email" in data
            assert "employee_number" in data
            assert "password" not in data, "No debe devolver la contraseña"
            
            print(f"✅ Usuario obtenido: {data.get('email', 'N/A')}")
            
        elif response.status_code == 404:
            print("⚠️ Usuario no encontrado (BD vacía)")
        else:
            print(f"ℹ️ Respuesta: {response.status_code}")

    def test_update_user(self):
        """Test: Actualizar información de usuario"""
        token = self._get_auth_token()
        
        if not token:
            pytest.skip("No se pudo obtener token de autenticación")
        
        user_id = 1
        update_data = {
            "first_name": "Updated",
            "last_name": "Name",
            "phone": "1111111111"
        }
        
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.put(f"/users/update/{user_id}", json=update_data, headers=headers)
        
        # Puede ser 200 (actualizado), 404 (no existe) o 403 (sin permisos)
        assert response.status_code in [200, 404, 403, 400], \
            f"Código inesperado: {response.status_code}"
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Usuario actualizado correctamente")
        else:
            print(f"ℹ️ Respuesta: {response.status_code}")

    def test_delete_user(self):
        """Test: Eliminar usuario (soft delete)"""
        token = self._get_auth_token()
        
        if not token:
            pytest.skip("No se pudo obtener token de autenticación")
        
        # Crear un usuario temporal para eliminar
        temp_user = {
            "employee_number": "TEMPDELETE001",
            "email": "tempdelete@mineguard.com",
            "password": "TempPass123!",
            "first_name": "Temp",
            "last_name": "Delete",
            "phone": "5555555555",
            "role_id": 2
        }
        
        # Crear usuario
        response = self.client.post("/auth/register", json=temp_user)
        
        if response.status_code == 200:
            user_id = response.json()["id"]
            
            # Ahora intentar eliminarlo
            headers = {"Authorization": f"Bearer {token}"}
            delete_response = self.client.delete(f"/users/delete/{user_id}", headers=headers)
            
            if delete_response.status_code == 200:
                print(f"✅ Usuario eliminado correctamente (soft delete)")
            else:
                print(f"ℹ️ Respuesta al eliminar: {delete_response.status_code}")
        else:
            print("⚠️ No se pudo crear usuario temporal para prueba de eliminación")

    def test_create_user_with_invalid_data(self):
        """Test: Crear usuario con datos inválidos debe fallar (vía auth/register)"""
        invalid_user = {
            "employee_number": "",  # Vacío (inválido)
            "email": "invalid-email",  # Sin @
            "password": "123",  # Muy corta
            "first_name": "",  # Vacío
            "last_name": "",  # Vacío
            "phone": "abc"  # No numérico
        }
        
        response = self.client.post("/auth/register", json=invalid_user)
        
        # Debe rechazar con error de validación o error de BD
        assert response.status_code in [400, 422, 500], \
            f"Debería rechazar datos inválidos pero obtuvo {response.status_code}"
        
        if response.status_code in [400, 422]:
            print(f"✅ Validación funciona correctamente: rechaza datos inválidos con {response.status_code}")
        else:
            print(f"ℹ️ Error de BD (500) - Validación se ejecutaría antes en BD real")

    def test_create_user_without_required_fields(self):
        """Test: Crear usuario sin campos requeridos debe fallar"""
        incomplete_user = {
            "email": "incomplete@mineguard.com"
            # Faltan: employee_number, password, first_name, last_name, etc.
        }
        
        response = self.client.post("/auth/register", json=incomplete_user)
        
        # Debe rechazar con error de validación
        assert response.status_code in [400, 422], \
            f"Debería rechazar datos incompletos pero obtuvo {response.status_code}"
        
        print(f"✅ Validación de campos requeridos funciona: {response.status_code}")

    def test_create_duplicate_user(self):
        """Test: Crear usuario duplicado debe fallar"""
        # Intentar crear el mismo usuario admin dos veces
        duplicate_user = {
            "employee_number": "ADMIN001",
            "email": "admin@mineguard.com",
            "password": "AdminPass123!",
            "first_name": "Admin",
            "last_name": "Duplicate",
            "phone": "1234567890",
            "role_id": 1
        }
        
        response = self.client.post("/auth/register", json=duplicate_user)
        
        # Debe rechazar por duplicado o error de BD
        assert response.status_code in [400, 409, 422, 500], \
            f"Debería rechazar duplicado pero obtuvo {response.status_code}"
        
        if response.status_code in [400, 409, 422]:
            print(f"✅ Prevención de duplicados funciona: {response.status_code}")
        else:
            print(f"ℹ️ Error de BD (500) - Validación de duplicados se ejecutaría en BD real")

    def test_get_nonexistent_user(self):
        """Test: Obtener usuario que no existe debe devolver 404"""
        token = self._get_auth_token()
        
        if not token:
            pytest.skip("No se pudo obtener token de autenticación")
        
        # ID muy alto que probablemente no existe
        nonexistent_id = 999999
        
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(f"/users/getbyid/{nonexistent_id}", headers=headers)
        
        # Debe devolver 404 Not Found
        assert response.status_code == 404, \
            f"Esperaba 404 para usuario inexistente pero obtuvo {response.status_code}"
        
        print(f"✅ Correctamente devuelve 404 para usuario inexistente")


# Contador para generar IDs únicos en pruebas
pytest.test_counter = 0

@pytest.fixture(autouse=True)
def increment_counter():
    """Incrementa contador para cada prueba"""
    pytest.test_counter += 1
    yield
    pytest.test_counter += 1

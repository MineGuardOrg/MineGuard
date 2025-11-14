# Guía de Pruebas - MineGuard Backend

## 📋 Descripción General

Las pruebas están organizadas por módulos siguiendo la estructura del backend. Cada módulo tiene su archivo `test_endpoints_simple.py` que prueba la disponibilidad y validación de sus endpoints.

## 🚀 Comandos de Ejecución

### Activar Entorno Virtual (Windows PowerShell)
```powershell
.\venv\Scripts\Activate.ps1
```

### Ejecutar pruebas por módulo específico

```bash
# Pruebas del módulo Auth
python -m pytest tests/modules/auth/test_endpoints_simple.py -v

# Pruebas del módulo Users
python -m pytest tests/modules/users/test_endpoints_simple.py -v

# Pruebas del módulo Area
python -m pytest tests/modules/area/test_endpoints_simple.py -v

# Pruebas del módulo Device
python -m pytest tests/modules/device/test_endpoints_simple.py -v

# Pruebas del módulo Role
python -m pytest tests/modules/role/test_endpoints_simple.py -v
```

### Ejecutar todas las pruebas
```bash
python -m pytest tests/modules/ -v
```

### Opciones útiles
```bash
python -m pytest tests/modules/auth/test_endpoints_simple.py -v  # Verbose (más detalles)
python -m pytest tests/modules/auth/test_endpoints_simple.py -v -s  # Mostrar prints
python -m pytest tests/modules/auth/test_endpoints_simple.py -x  # Parar en primer fallo
```

## 📊 Interpretación de Resultados

### Estados de Pruebas

- **PASSED** ✅: La prueba se ejecutó correctamente
- **FAILED** ❌: La prueba falló, hay un error  
- **SKIPPED** ⚠️: La prueba se omitió (esperado en algunos casos)

### Ejemplo de Salida del Módulo Auth

```
tests/modules/auth/test_endpoints_simple.py::TestAuthEndpointsSimple::test_auth_endpoint_availability PASSED [ 20%]
tests/modules/auth/test_endpoints_simple.py::TestAuthEndpointsSimple::test_auth_login_endpoint_availability PASSED [ 40%]
tests/modules/auth/test_endpoints_simple.py::TestAuthEndpointsSimple::test_auth_me_endpoint_availability SKIPPED [ 60%]
tests/modules/auth/test_endpoints_simple.py::TestAuthEndpointsSimple::test_register_with_invalid_data PASSED [ 80%]
tests/modules/auth/test_endpoints_simple.py::TestAuthEndpointsSimple::test_login_without_credentials PASSED [100%]
```

## 🔍 ¿Qué Pruebas se Ejecutan?

### Módulo Auth (Autenticación)

| Prueba | ¿Qué hace? | Endpoint | Query/Petición |
|--------|------------|----------|----------------|
| `test_auth_endpoint_availability` | Verifica que el endpoint de registro responda | `POST /auth/register` | Envía `{}` vacío y espera respuesta 400/422/500/200 |
| `test_auth_login_endpoint_availability` | Verifica que el endpoint de login responda | `POST /auth/login` | Envía `{}` vacío y espera respuesta 400/422/500/200 |
| `test_auth_me_endpoint_availability` | Verifica que el endpoint de usuario actual responda | `GET /auth/me` | Sin datos, espera 401/403/422/500/200 |
| `test_register_with_invalid_data` | Prueba validación: debe rechazar datos inválidos | `POST /auth/register` | Envía email inválido y password corto, espera 400/422 |
| `test_login_without_credentials` | Prueba validación: debe rechazar login sin credenciales | `POST /auth/login` | Envía `{}` vacío, espera 400/422 |

### Módulo Users (Usuarios)

| Prueba | ¿Qué hace? | Endpoint | Query/Petición |
|--------|------------|----------|----------------|
| `test_users_list_endpoint_availability` | Verifica que el endpoint de listar usuarios responda | `GET /users/` | Sin datos, espera respuesta |
| `test_users_create_endpoint_availability` | Verifica que el endpoint de crear usuario responda | `POST /users/` | Envía `{}` vacío |
| `test_users_get_by_id_endpoint_availability` | Verifica que el endpoint de obtener usuario por ID responda | `GET /users/1` | Busca usuario con ID=1 |
| `test_users_update_endpoint_availability` | Verifica que el endpoint de actualizar usuario responda | `PUT /users/1` | Intenta actualizar usuario ID=1 |
| `test_users_delete_endpoint_availability` | Verifica que el endpoint de eliminar usuario responda | `DELETE /users/1` | Intenta eliminar usuario ID=1 |
| `test_users_invalid_data_validation` | Prueba validación: debe rechazar datos inválidos | `POST /users/` | Envía datos inválidos, espera 400/401/403/422 |


## 📝 Notas Importantes

1. **Warnings deshabilitados**: Las pruebas se ejecutan con `--disable-warnings` configurado en `pytest.ini` para evitar warnings innecesarios de Pydantic.
2. **Pruebas de integración**: Las pruebas actuales verifican que los endpoints respondan correctamente.
3. **Pruebas SKIPPED**: Algunas pruebas se omiten si requieren autenticación previa (ejemplo: `/auth/me` requiere token).
4. **Códigos de respuesta**: Las pruebas verifican que los endpoints respondan con códigos HTTP válidos.

## 🏗️ Estructura de Pruebas

```
tests/
├── conftest.py                      # Configuración global y fixtures
├── pytest.ini                       # Configuración de pytest
└── modules/
    ├── auth/
    │   └── test_endpoints_simple.py # Pruebas de autenticación
    ├── users/
    │   └── test_endpoints_simple.py # Pruebas de usuarios
    ├── area/
    │   └── test_endpoints_simple.py # Pruebas de áreas
    ├── device/
    │   └── test_endpoints_simple.py # Pruebas de dispositivos
    └── role/
        └── test_endpoints_simple.py # Pruebas de roles
```

## 🔧 Solución de Problemas

### Error: "No module named 'app'"
Asegúrate de estar en el directorio `backend`:
```powershell
cd backend
python -m pytest tests/modules/auth/test_endpoints_simple.py -v
```

### Ver muchos warnings
Los warnings están deshabilitados por defecto en `pytest.ini`. Si los ves, asegúrate de que `pytest.ini` esté actualizado.

### Error: SQLAlchemy "Table already defined"
Este error se solucionó usando `--import-mode=importlib` en `pytest.ini`.


### Filtros y selección
```bash
pytest -k "auth"                    # Solo pruebas con "auth" en el nombre
pytest -k "not slow"                # Excluir pruebas marcadas como lentas
pytest tests/test_auth_simple.py::TestBasicAuth::test_register_endpoint_exists  # Prueba específica
```

### Debug y desarrollo
```bash
pytest --collect-only              # Solo mostrar qué pruebas se ejecutarían
pytest --markers                   # Mostrar marcadores disponibles
pytest -v --tb=short --disable-warnings  # Modo desarrollo limpio
```

## Archivos de Configuración

- `pytest.ini`: Configuración principal de pytest
- `.env.test`: Variables de entorno para testing
- `tests/conftest.py`: Fixtures y configuración global

## Estructura de Pruebas

```
tests/
├── test_basic.py           # Pruebas básicas de funcionamiento
├── test_main.py           # Pruebas de la aplicación principal
├── conftest.py            # Configuración global
├── fixtures/              # Datos de prueba
│   └── sample_data.py
└── modules/               # Pruebas organizadas por módulos
    ├── auth/
    │   ├── test_endpoints.py    # Endpoints de autenticación
    │   └── test_service.py      # Servicio de autenticación
    ├── users/
    │   ├── test_endpoints.py    # Endpoints de usuarios
    │   └── test_service.py      # Servicio de usuarios
    ├── area/
    │   └── test_endpoints.py
    ├── device/
    │   └── test_endpoints.py
    └── _template_endpoints.py   # Template para nuevos módulos
```

## Marcadores (Markers)

### Por módulo
- `@pytest.mark.auth`: Pruebas del módulo auth
- `@pytest.mark.users`: Pruebas del módulo users  
- `@pytest.mark.area`: Pruebas del módulo area
- `@pytest.mark.device`: Pruebas del módulo device
- `@pytest.mark.role`: Pruebas del módulo role

### Por tipo
- `@pytest.mark.unit`: Pruebas unitarias
- `@pytest.mark.integration`: Pruebas de integración
- `@pytest.mark.database`: Pruebas de base de datos
- `@pytest.mark.slow`: Pruebas lentas

## Tips de Desarrollo

1. **Ejecuta pruebas frecuentemente**: `pytest -m auth -v`
2. **Usa --tb=short para menos ruido**: `pytest --tb=short`
3. **Desarrolla paso a paso**: Empieza con test_basic.py
4. **Revisa cobertura regularmente**: `pytest --cov=app`
5. **Usa -k para pruebas específicas**: `pytest -k "register"`
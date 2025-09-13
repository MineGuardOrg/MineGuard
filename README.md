# MineGuard

Repositorio principal de la aplicación **MineGuard**, con backend (FastAPI), web (Angular) y mobile (Android/Kotlin).

---

## 🗂 Estructura del repositorio

MineGuard/
├── backend/ # FastAPI backend
├── web/ # Angular frontend
├── mobile/ # Kotlin/Android app
└── README.md

---

## 🔹 Backend (FastAPI)

### Requisitos
- Python 3.11+
- MySQL (Azure Flexible Server)
- `pip` instalado

### Primeros pasos

1. Clonar el repositorio:

```bash
git clone <url_del_repo>
cd MineGuard/backend
```

2. Crear y activar el entorno virtual:

**Windows**

```bash
python -m venv venv
venv\Scripts\activate
```

**Linux / Mac**

```bash
python3 -m venv venv
source venv/bin/activate
```

3. Instalar dependencias:

```bash
pip install -r requirements.txt
```

4. Configurar las variables de entorno en `.env`:

```ini
DB_USER=mineguardadmin
DB_PASSWORD=TuPasswordSegura123!
DB_HOST=dbmysql-mineg.mysql.database.azure.com
DB_PORT=3306
DB_NAME=mineguarddb
```
⚠️ No subir el .env al repositorio.

5. Ejecutar la API:

```bash
uvicorn app.main:app --reload
```

6. Acceder a la documentación Swagger:

http://127.0.0.1:8000/docs

## 🔹 Web (Angular)
A completar según la configuración del proyecto web

## 🔹 Mobile (Android/Kotlin)
A completar según la configuración del proyecto móvil

---

## 📝 Notas

El backend ya incluye una estructura Clean / Layered Architecture:

- `app/api/` → Endpoints
- `app/application/` → Lógica de negocio (services)
- `app/domain/` → Entidades y schemas
- `app/infrastructure/` → Repositorios, base de datos, adaptadores externos
- `app/core/` → Configuración general y seguridad
- `app/tests/` → Pruebas unitarias

El proyecto utiliza `.gitignore` global en la raíz para todos los subproyectos.

Para futuras versiones de la API, se recomienda usar versionado (`v1`, `v2`) en `api/`.
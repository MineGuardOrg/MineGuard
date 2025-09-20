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
git clone https://github.com/MineGuardOrg/MineGuard.git
cd MineGuard/backend
```

2. Crear y activar el entorno virtual:

**Windows**

```bash
python -m venv venv
venv\Scripts\activate
```

**Linux**

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
DB_USER=DB_USER
DB_PASSWORD=DB_PASSWORD!
DB_HOST=DB_HOST
DB_PORT=DB_PORT
DB_NAME=DB_NAME
```
⚠️ No subir el .env al repositorio.

5. Ejecutar la API:

```bash
uvicorn app.main:app --reload
```

6. Acceder a la documentación Swagger:

http://127.0.0.1:8000/docs

## 🔹 Web (Angular)

1. Entrar al proyecto Web

```bash
cd MineGuard/web
```

2. Instalar dependencias

```bash
npm install
```

3. Una vez terminado de descargar las dependencias del proyecto, ejecutar:

```bash
ng serve 
```

4. Acceder al proyecto de Web:

http://localhost:4200/

## 🔹 Mobile (Android/Kotlin)
A completar según la configuración del proyecto móvil

---

## 🔒 Certificado SSL para conexión a MySQL (Azure)

Para conectar el backend con Azure Database for MySQL usando SSL:

1. Descarga el certificado raíz `BaltimoreCyberTrustRoot.crt.pem` desde:
   https://www.digicert.com/kb/digicert-root-certificates.htm
   (Busca "Baltimore CyberTrust Root" y descarga el archivo en formato PEM)

2. Crea la carpeta `certs/` dentro de `backend/` y coloca ahí el archivo descargado.

3. Agrega la ruta relativa al archivo en tu `.env`:
   ```
   DB_SSL_CERT=certs/BaltimoreCyberTrustRoot.crt.pem
   ```

4. **No subas la carpeta `certs/` ni el certificado al repositorio.**
   Cada colaborador debe descargarlo y colocarlo localmente.

---

## 🧪 Probar conexión a la base de datos

Para verificar que la configuración y el certificado SSL funcionan correctamente, ejecuta el siguiente comando desde la carpeta `backend`:

```bash
python app/infrastructure/test_db_connection.py
```

Si la conexión es exitosa, verás:
```
✅ Conexión exitosa a la base de datos.
```

Si hay algún error, revisa las variables en `.env`, la ruta del certificado y la configuración de tu servidor MySQL en Azure.

---

## 📝 Notas

El backend ya incluye una estructura Clean / Layered Architecture:

- `app/api/` → Endpoints
- `app/application/` → Lógica de negocio (services)
- `app/domain/` → Entidades y schemas
- `app/infrastructure/` → DAOs, base de datos, adaptadores externos
- `app/core/` → Configuración general y seguridad
- `app/tests/` → Pruebas unitarias

El proyecto utiliza `.gitignore` global en la raíz para todos los subproyectos.
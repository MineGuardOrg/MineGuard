# MineGuard

Sistema integral de **supervisión y seguridad minera** con cascos inteligentes IoT y dashboards en tiempo real.

**Stack tecnológico:**
- 🐍 **Backend:** FastAPI + Python + MySQL
- 🌐 **Web:** Angular + TypeScript  
- 📱 **Mobile:** Kotlin + Jetpack Compose + Retrofit

---

## 🗂 Estructura del repositorio

```
MineGuard/
├── backend/          # 🐍 API FastAPI + Python + MySQL
├── web/              # 🌐 Frontend Angular + TypeScript  
├── mobile/           # 📱 App Android + Kotlin + Jetpack Compose
└── README.md         # 📚 Documentación principal
```

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

⚠️ No subir el .env al repositorio.

5. Ejecutar la API:

```bash
uvicorn app.main:app --reload
```

6. Acceder a la documentación Swagger:

http://127.0.0.1:8000/docs

## 🧑‍💻 Flujo de trabajo con Git y ramas

⚠️ La rama `main` está protegida. NO hagas push directo a `main`. Usa ramas y Pull Requests.

### Flujo de trabajo para el equipo:
1. **Crear una nueva rama desde `develop`:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b user/cambio-realizado
   ```

2. **Hacer commits:**
   ```bash
   git add .
   git commit -m "Descripción clara del cambio"
   git pull origin develop
   ```

3. **Subir la rama al repositorio remoto:**
   - Sube tu rama al repositorio remoto:
     ```bash
     git push origin user/app-o-crud-realizado (nombre de tu rama creada)
     ```
4. **Crear un Pull Request hacia `develop`:**
   - Ve a [GitHub](https://github.com/MineGuardOrg/MineGuard/pulls).
   - Crea un Pull Request
   - Base: develop  |  compare: Tu rama de trabajo (por ejemplo, user/app-o-crud-realizado)
   - Escribe un título y descripción claros para el Pull Request.
   - Solicita la revisión del owner y espera su aprobación.

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

Aplicación móvil para **supervisión de mineros** desarrollada con tecnologías modernas de Android.

### 🛠️ Stack Tecnológico
- **Lenguaje:** Kotlin
- **UI Framework:** Jetpack Compose
- **Networking:** Retrofit + OkHttp
- **Arquitectura:** MVVM Modular
- **Navegación:** Navigation Compose
- **Injection:** Hilt (próximo)

### 🏗️ Arquitectura MVVM Modular

```
com.example.mobile/
├── MainActivity.kt              # Punto de entrada
├── core/                       # Configuraciones esenciales
│   └── utils/                  # Extensions, Constants, Helpers
├── data/                       # Capa de datos unificada
│   ├── api/                   # Services de API (Retrofit)
│   ├── database/              # Room entities y DAOs
│   └── repository/            # Repositories (patrón Repository)
├── model/                     # Modelos de dominio
│   └── *.kt                   # User, Alert, Device, etc.
└── ui/                        # Capa de presentación
    ├── components/            # Componentes Compose reutilizables
    ├── navigation/            # Navegación entre pantallas
    ├── screens/               # Pantallas principales
    ├── theme/                 # Temas, colores, tipografías
    └── viewmodel/             # ViewModels (MVVM)
```

### 🚀 Configuración del proyecto

#### Requisitos
- **Android Studio** Arctic Fox o superior
- **JDK 11** o superior
- **Gradle 8.13**
- **Android API Level:** Min 24, Target 36

#### Primeros pasos

1. **Clonar el repositorio:**
```bash
git clone https://github.com/MineGuardOrg/MineGuard.git
cd MineGuard/mobile
```

2. **Abrir en Android Studio:**
   - Abrir Android Studio
   - File → Open → Seleccionar carpeta `MineGuard/mobile`
   - Esperar sincronización de Gradle

3. **Compilar el proyecto:**
```bash
./gradlew assembleDebug
```

4. **Ejecutar en dispositivo/emulador:**
   - Conectar dispositivo Android o iniciar emulador
   - Presionar botón "Run" en Android Studio
   - O usar comando: `./gradlew installDebug`

#### 🔧 Variables de entorno

Crear archivo `local.properties` en la raíz del proyecto mobile:
```properties
# API Backend
API_BASE_URL=http://127.0.0.1:8000/
# Firebase (para notificaciones push)
FIREBASE_PROJECT_ID=mineguard-project
```

⚠️ **No subir `local.properties` al repositorio.**

### 🧪 Testing

```bash
# Tests unitarios
./gradlew test

# Tests de interfaz
./gradlew connectedAndroidTest
```

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
- `app/core/` → Configuración general y seguridad
- `app/domain/` → Entidades y schemas
- `app/infrastructure/` → DAOs, base de datos, adaptadores externos
- `app/tests/` → Pruebas unitarias

El proyecto utiliza `.gitignore` global en la raíz para todos los subproyectos.

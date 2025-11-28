# MineGuard

Sistema integral de **supervisión y seguridad minera** con cascos inteligentes IoT y dashboards en tiempo real.

**Stack tecnológico:**
- 🐍 **Backend:** FastAPI + Python + MySQL
- 🌐 **Web:** Angular + TypeScript  
- 📱 **Mobile:** React Native + Expo + TypeScript

---

## 🗂 Estructura del repositorio

```
MineGuard/
├── backend/          # 🐍 API FastAPI + Python + MySQL
├── web/              # 🌐 Frontend Angular + TypeScript  
├── mobile/           # 📱 App React Native + Expo (iOS/Android)
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

## 🔹 Mobile (React Native + Expo)

Aplicación móvil multiplataforma para **supervisión de mineros** con soporte iOS y Android.

### 🛠️ Stack Tecnológico
- **Framework:** React Native + Expo
- **Lenguaje:** TypeScript
- **Networking:** Axios + Socket.IO
- **Arquitectura:** Modular (Auth + Dashboard)
- **Navegación:** React Navigation
- **Storage:** AsyncStorage
- **Testing:** Compatible con iPad desde Windows sin Mac

### 🏗️ Arquitectura Modular

```
mobile/src/
├── core/                       # ⚙️ Configuración base
│   ├── config.ts              # URLs backend (API + WebSocket)
│   ├── api.ts                 # Cliente HTTP con auth
│   └── storage.ts             # AsyncStorage wrapper
├── modules/                   # 📦 Módulos de la app
│   ├── auth/                  # 🔐 Autenticación
│   │   ├── screens/           # LoginScreen
│   │   ├── services/          # AuthService
│   │   └── types/             # Tipos TypeScript
│   └── dashboard/             # 📊 Dashboard tiempo real
│       ├── screens/           # DashboardScreen
│       ├── components/        # StatCard, WorkerCard, AlertCard
│       ├── services/          # DashboardService + WebSockets
│       └── types/             # Tipos TypeScript
├── navigation/                # 🧭 Navegación
│   └── AppNavigator.tsx
└── types/                     # Tipos globales
```

### 🚀 Configuración del proyecto

#### Requisitos
- **Node.js** 18 o superior
- **npm** o **yarn**
- **Expo Go** app (en tu dispositivo iOS/Android)
- Para compilar nativamente: **EAS CLI**

#### Primeros pasos

1. **Clonar el repositorio:**
```bash
git clone https://github.com/MineGuardOrg/MineGuard.git
cd MineGuard/mobile
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar URL del backend:**

Edita `src/core/config.ts`:

```typescript
export const API_BASE_URL = 'http://TU_IP:8000';  // ⬅️ CAMBIAR
export const WS_BASE_URL = 'ws://TU_IP:8000';
```

**Ejemplos según tu caso:**

- **Dispositivo físico (misma WiFi):** `http://192.168.1.XX:8000`
- **Android Emulator:** `http://10.0.2.2:8000`
- **Backend en la nube:** `https://tu-dominio.com`

💡 **Cómo encontrar tu IP local:**
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig | grep inet
```

4. **Iniciar servidor de desarrollo:**
```bash
npm start
```

Se mostrará un QR code en la terminal.

5. **Probar en tu dispositivo:**
   - **iOS:** Descarga Expo Go desde App Store, escanea el QR con la cámara
   - **Android:** Descarga Expo Go desde Play Store, escanea el QR desde la app

### 📱 Ejecución en emuladores

**Android:**
```bash
npm run android
```

**iOS (solo Mac):**
```bash
npm run ios
```

**Web:**
```bash
npm run web
```

### 📦 Compilar APK/IPA (sin Mac)

Usando **EAS Build** (gratis):

1. **Instalar EAS CLI:**
```bash
npm install -g eas-cli
```

2. **Login en Expo:**
```bash
eas login
```

3. **Configurar proyecto:**
```bash
eas build:configure
```

4. **Compilar Android:**
```bash
eas build --platform android --profile preview
```

5. **Compilar iOS (sin Mac):**
```bash
eas build --platform ios --profile preview
```

### 🔧 Variables de entorno

Las URLs del backend se configuran en `src/core/config.ts`. 

⚠️ **No subir credenciales sensibles al repositorio.**

### 🧪 Testing

```bash
# Tests unitarios (cuando estén implementados)
npm test

# Limpiar caché
npm start --reset-cache
```

### 🎯 Funcionalidades implementadas

✅ Login con backend FastAPI  
✅ Dashboard en tiempo real con WebSockets  
✅ Monitoreo de trabajadores activos  
✅ Alertas en tiempo real  
✅ Biométricas por área  
✅ Pull-to-refresh  
✅ Optimizado para iPad y móviles  
✅ Navegación automática (Login → Dashboard)  
✅ Almacenamiento seguro de tokens

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

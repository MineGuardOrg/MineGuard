# MineGuard Mobile App - Kotlin Multiplatform

## 🏗️ Arquitectura Modular

Este proyecto utiliza una arquitectura modular para Kotlin Multiplatform, enfocada en iOS/iPad:

```
MineguardApp/
├── composeApp/              # App principal (orchestrator)
├── core/                    # Módulo core - Networking, DI, Storage
│   ├── network/            # HttpClient, WebSocket, ApiResponse
│   ├── data/               # TokenStorage (iOS/Android)
│   └── di/                 # Koin modules
├── feature/
│   ├── auth/               # Feature módulo: Autenticación
│   │   ├── data/           # Models, Repository
│   │   ├── presentation/   # ViewModels, Screens
│   │   └── di/             # Auth DI module
│   └── dashboard/          # Feature módulo: Dashboard en tiempo real
│       ├── data/           # Models, Repository, WebSocket
│       ├── presentation/   # ViewModels, Screens
│       └── di/             # Dashboard DI module
```

## 📱 Features

### ✅ Autenticación
- Login con número de empleado y contraseña
- Almacenamiento seguro de tokens (UserDefaults en iOS, DataStore en Android)
- Manejo de sesión con JWT
- UI optimizada para iPad

### ✅ Dashboard en Tiempo Real
- Lista de trabajadores activos con métricas
- Alertas recientes con severidad
- Gráficas de biométricos por área
- Soporte para WebSocket (actualizaciones en tiempo real)
- Layout adaptativo para iPad

## 🛠️ Stack Tecnológico

- **Kotlin Multiplatform** 2.2.20
- **Compose Multiplatform** 1.9.1
- **Ktor Client** 2.3.7 (networking + WebSockets)
- **Koin** 3.5.3 (Dependency Injection)
- **Kotlinx Serialization** 1.6.2
- **Navigation Compose** 2.8.0-alpha10
- **Lifecycle ViewModel** 2.9.5

## 🚀 Configuración Inicial

### 1. Configurar URL del Backend

Actualiza la URL de tu backend en:
```kotlin
// core/src/commonMain/kotlin/.../core/network/HttpClient.kt
object NetworkConfig {
    const val BASE_URL = "https://tu-backend-url.com"  // ⚠️ ACTUALIZAR
    const val WS_URL = "wss://tu-backend-url.com"      // ⚠️ ACTUALIZAR
}
```

### 2. Build del Proyecto

```bash
# iOS (desde MineguardApp/)
./gradlew :composeApp:iosSimulatorArm64ProcessResources

# Android
./gradlew :composeApp:assembleDebug
```

### 3. Abrir en Xcode (iOS)

```bash
cd iosApp
open iosApp.xcodeproj
```

## 📦 Módulos

### Core Module
**Propósito**: Funcionalidad compartida entre features
- `HttpClient` configurado con autenticación, logging, timeouts
- `TokenStorage` interface con implementaciones por plataforma
- `ApiResponse` sealed class para manejo de respuestas
- Koin DI configuration

### Feature: Auth
**Propósito**: Autenticación de usuarios
- `LoginScreen` optimizada para iPad
- `AuthRepository` con métodos login/logout/getCurrentUser
- Modelos alineados con backend FastAPI
- Token management automático

### Feature: Dashboard
**Propósito**: Dashboard en tiempo real
- `DashboardScreen` con layout para iPad
- `DashboardRepository` para obtener datos del backend
- `WebSocketClient` para actualizaciones en tiempo real
- Tarjetas de trabajadores activos y alertas

## 🔧 Próximos Pasos

### Funcionalidades Pendientes:
1. **Gráficas Interactivas**: Implementar charts con Vico para biométricos
2. **WebSocket Real-Time**: Conectar WebSocket para actualizaciones automáticas
3. **Pull to Refresh**: Añadir SwipeRefresh en listas
4. **Notificaciones Push**: Para alertas críticas
5. **Modo Offline**: Cache local con Room/SQLDelight
6. **Tests**: Unit tests y UI tests

### Mejoras de Seguridad:
- [ ] Usar Keychain en iOS para tokens (en lugar de UserDefaults)
- [ ] Implementar refresh token
- [ ] Certificate pinning para HTTPS
- [ ] Ofuscación de código en release builds

### UI/UX para iPad:
- [ ] Modo landscape optimizado
- [ ] Split view para multitarea
- [ ] Dark mode
- [ ] Animaciones y transiciones
- [ ] Filtros y búsqueda en dashboard

## 📝 Estructura de API (Backend FastAPI)

### Auth Endpoints:
- `POST /auth/login` - Login
- `GET /auth/me` - Usuario actual

### Dashboard Endpoints:
- `GET /dashboard/active-workers` - Trabajadores activos
- `GET /dashboard/alerts/last-month-by-type` - Conteo de alertas
- `GET /dashboard/biometrics/avg-by-area` - Biométricos por área
- `GET /dashboard/alerts/recent` - Alertas recientes

## 🐛 Troubleshooting

### Gradle Sync Issues
```bash
./gradlew clean
./gradlew --refresh-dependencies
```

### iOS Build Issues
```bash
cd iosApp
pod install --repo-update
```

### Token no persiste
Verificar que `platformModule()` esté incluido en Koin initialization en `App.kt`

## 📄 License
MineGuard - Sistema de Monitoreo Minero

---
Desarrollado con ❤️ usando Kotlin Multiplatform
Optimizado para iPad 🍎

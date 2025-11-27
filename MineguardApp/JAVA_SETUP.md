# ⚠️ CONFIGURACIÓN REQUERIDA - Java 17

## Problema Actual
El proyecto requiere **Java 17** para compilar con Android Gradle Plugin 8.11.2.
Actualmente tienes Java 11 instalado.

## Solución 1: Instalar Java 17 (Recomendado)

### Opción A: Descargar OpenJDK 17
1. Ve a: https://adoptium.net/temurin/releases/
2. Selecciona:
   - **Version**: 17 (LTS)
   - **Operating System**: Windows
   - **Architecture**: x64
3. Descarga el instalador `.msi`
4. Instala en: `C:\Program Files\Eclipse Adoptium\jdk-17`

### Opción B: Usar SDKMAN (si tienes Git Bash/WSL)
```bash
sdk install java 17-tem
```

### Después de instalar Java 17:
Actualiza `gradle.properties` con:
```properties
org.gradle.java.home=C:/Program Files/Eclipse Adoptium/jdk-17.0.x
```

## Solución 2: Downgrade AGP (Temporal)

Si no puedes instalar Java 17 ahora, puedes bajar la versión de AGP temporalmente:

### En `gradle/libs.versions.toml`:
```toml
[versions]
agp = "8.2.2"  # En lugar de 8.11.2
```

**Nota**: Esto puede causar incompatibilidades con algunas características modernas de Android.

## Verificar Java Instalado

Para verificar qué versiones de Java tienes:
```powershell
# Ver Java actual
java -version

# Buscar todas las instalaciones
Get-ChildItem "C:\Program Files" -Recurse -Filter "java.exe" -ErrorAction SilentlyContinue
```

## Compilar después de configurar

```bash
# Limpiar y compilar
./gradlew clean
./gradlew :core:assemble
./gradlew :feature:auth:assemble
./gradlew :feature:dashboard:assemble
./gradlew :composeApp:assemble
```

## Para iOS (Xcode)

iOS no necesita Java, solo Xcode 15+:
```bash
cd iosApp
open iosApp.xcodeproj
```

Compila directamente desde Xcode para iPad.

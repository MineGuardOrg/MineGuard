# MineGuard - Sistema de Predicción Estudiantil 🎓

Sistema de predicción de reprobación estudiantil usando Machine Learning con FastAPI y Vanilla JavaScript.

## 🎯 Características

- **Dashboard interactivo** con estadísticas en tiempo real
- **Carga de datasets** (CSV/Excel) de estudiantes
- **Entrenamiento de modelos ML**:
  - RandomForestClassifier para clasificación (predicción de reprobación)
  - DecisionTreeRegressor para regresión (estimación de calificación)
- **Predicciones individuales** con probabilidad de reprobación y calificación estimada
- **API RESTful** completa con FastAPI
- **Frontend moderno** con Bootstrap 5

## 📋 Stack Tecnológico

### Backend
- **FastAPI** - Framework web moderno y rápido
- **SQLAlchemy** - ORM para manejo de base de datos
- **MySQL** - Base de datos relacional
- **scikit-learn** - Modelos de Machine Learning
- **XGBoost** - Modelo avanzado de boosting
- **Pandas & NumPy** - Procesamiento de datos

### Frontend
- **HTML5, CSS3, JavaScript Vanilla**
- **Bootstrap 5** - Framework CSS
- **Fetch API** - Consumo de API REST

## 🚀 Instalación

### Requisitos Previos
- Python 3.8 o superior
- MySQL 5.7 o superior
- pip (gestor de paquetes de Python)

### Paso 1: Configurar la Base de Datos

```sql
CREATE DATABASE mineguard;
```

### Paso 2: Configurar el Backend

1. Navegar a la carpeta backend:
```powershell
cd backend
```

2. Crear un entorno virtual:
```powershell
python -m venv venv
```

3. Activar el entorno virtual:
```powershell
.\venv\Scripts\Activate.ps1
```

4. Instalar dependencias:
```powershell
pip install -r requirements.txt
```

5. Configurar variables de entorno:
```powershell
Copy-Item .env.example .env
```

Editar `.env` con tus credenciales de MySQL:
```env
DATABASE_URL=mysql+mysqldb://tu_usuario:tu_password@localhost:3306/mineguard
```

### Paso 3: Ejecutar el Backend

```powershell
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

El servidor estará disponible en: `http://localhost:8000`

Documentación API: `http://localhost:8000/docs`

### Paso 4: Ejecutar el Frontend

1. Abrir `frontend/index.html` en un navegador web

O usar un servidor HTTP simple:
```powershell
cd frontend
python -m http.server 3000
```

Acceder a: `http://localhost:3000`

## 📁 Estructura del Proyecto

```
proyectofinal/
├── backend/
│   ├── app/
│   │   ├── main.py              # Punto de entrada de FastAPI
│   │   ├── database.py          # Configuración de BD
│   │   ├── routers/
│   │   │   ├── students.py      # CRUD de estudiantes
│   │   │   ├── dataset.py       # Upload de datasets
│   │   │   ├── ml_routes.py     # Entrenamiento y predicción
│   │   │   └── dashboard.py     # Estadísticas
│   │   ├── models/
│   │   │   └── student.py       # Modelo SQLAlchemy
│   │   ├── schemas/
│   │   │   └── student.py       # Schemas Pydantic
│   │   ├── services/            # Lógica de negocio
│   │   └── ml/
│   │       ├── train.py         # Entrenamiento ML
│   │       └── predict.py       # Predicciones
│   ├── models/                  # Modelos entrenados (.joblib)
│   ├── requirements.txt         # Dependencias Python
│   └── .env                     # Variables de entorno
├── frontend/
│   ├── index.html              # Página principal
│   └── assets/
│       ├── main.js             # Lógica JavaScript
│       └── styles.css          # Estilos personalizados
└── README.md
```

## 🔌 API Endpoints

### Estudiantes
- `GET /api/students` - Listar estudiantes
- `GET /api/students/{id}` - Obtener estudiante
- `POST /api/students` - Crear estudiante
- `PUT /api/students/{id}` - Actualizar estudiante
- `DELETE /api/students/{id}` - Eliminar estudiante

### Dataset
- `POST /api/upload-dataset` - Subir archivo CSV/Excel

### Machine Learning
- `POST /api/train` - Entrenar modelos
- `POST /api/predict` - Realizar predicción

### Dashboard
- `GET /api/dashboard/variables` - Obtener estadísticas

## 📊 Formato del Dataset

El archivo CSV/Excel debe contener las siguientes columnas:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| nombre | string | Nombre del estudiante (obligatorio) |
| edad | int | Edad del estudiante |
| genero | string | Género (Masculino/Femenino/Otro) |
| promedio_anterior | float | Promedio del semestre anterior |
| asistencia | float | Porcentaje de asistencia (0-100) |
| horas_estudio | float | Horas de estudio semanal |
| participacion | float | Porcentaje de participación (0-100) |
| calificacion_actual | float | Calificación actual (opcional) |
| reprobo | int | 0 o 1 (opcional, para entrenamiento) |

## 🧪 Uso del Sistema

1. **Cargar Dataset**: Sube un archivo CSV/Excel con datos de estudiantes
2. **Entrenar Modelos**: Click en "Entrenar Modelos" después de cargar datos
3. **Realizar Predicciones**: Selecciona un estudiante y obtén predicciones
4. **Visualizar Dashboard**: Consulta estadísticas y métricas en tiempo real

## 🔧 Solución de Problemas

### Error de conexión a MySQL
- Verifica que MySQL esté corriendo
- Revisa las credenciales en `.env`
- Asegúrate de que la base de datos `mineguard` exista

### Error al instalar mysqlclient
```powershell
# En Windows, instalar Microsoft C++ Build Tools
# O usar alternativa:
pip install aiomysql
```

Luego cambiar en `requirements.txt` y `database.py`

### CORS Error en el frontend
- Verifica que el backend esté corriendo en el puerto 8000
- El CORS ya está configurado para aceptar todos los orígenes

## 📝 Licencia

Este proyecto es parte de un trabajo académico.

## 👥 Autores

Desarrollado para el curso de Machine Learning y Desarrollo Web.

---

**¡Buena suerte con tu proyecto! 🚀**

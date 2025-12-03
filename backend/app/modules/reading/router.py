# Router del módulo Reading
from fastapi import APIRouter, Depends, status, Query, WebSocket, WebSocketDisconnect
from typing import List, Optional
from datetime import datetime
from app.modules.reading.models import ReadingCreateSchema, ReadingUpdateSchema, ReadingSchema
from app.modules.reading.service import ReadingService
from app.core.security import get_current_user
import json

reading_router = APIRouter()
service = ReadingService()


# =====================================================
#                RUTAS HTTP EXISTENTES
# =====================================================

@reading_router.get("/", response_model=List[ReadingSchema])
def get_all(current_user=Depends(get_current_user)):
    return service.get_all()


@reading_router.get("/{reading_id}", response_model=ReadingSchema)
def get_by_id(reading_id: int, current_user=Depends(get_current_user)):
    return service.get_by_id(reading_id)


@reading_router.get("/by-device/{device_id}", response_model=List[ReadingSchema])
def by_device(
    device_id: int,
    start: Optional[datetime] = Query(None),
    end: Optional[datetime] = Query(None),
    current_user=Depends(get_current_user),
):
    """
    Obtiene todas las lecturas de un dispositivo específico.
    Incluye todos los valores de sensores (mq7, pulse, acelerómetro, giroscopio).
    """
    return service.get_by_device(device_id, start, end)


@reading_router.get("/by-device/{device_id}/latest", response_model=ReadingSchema)
def latest_by_device(device_id: int, current_user=Depends(get_current_user)):
    """
    Obtiene la última lectura de un dispositivo.
    """
    return service.get_latest_by_device(device_id)


@reading_router.get("/by-user/{user_id}", response_model=List[ReadingSchema])
def by_user(user_id: int, limit: int = 100, current_user=Depends(get_current_user)):
    """
    Obtiene las últimas lecturas de un usuario.
    Devuelve todas las lecturas con todos los sensores.
    """
    return service.get_by_user(user_id, limit)


@reading_router.post("/", response_model=ReadingSchema, status_code=status.HTTP_201_CREATED)
async def create(payload: ReadingCreateSchema, current_user=Depends(get_current_user)):
    """
    Crea una nueva lectura con todos los valores de sensores.
    Acepta: user_id, device_id, mq7, pulse, ax, ay, az, gx, gy, gz
    """
    return await service.create(payload)



# =====================================================
#                 WEBSOCKET PARA ESP32
# =====================================================

@reading_router.websocket("/ws/reading")
async def websocket_reading(websocket: WebSocket):
    """
    WebSocket para recibir lecturas directamente del ESP32.
    No requiere token ni autenticación (hardware no maneja JWT).
    Formato esperado:
    {
        "user_id": 1,
        "device_id": 1,
        "mq7": 403,
        "pulse": 72,
        "ax": 0.12,
        "ay": 9.81,
        "az": -0.21,
        "gx": 0.02,
        "gy": 0.01,
        "gz": 0.00
    }
    """
    await websocket.accept()
    print("ESP32 conectado al WebSocket /ws/reading")

    try:
        while True:
            raw_msg = await websocket.receive_text()

            # Intentar parsear el JSON
            try:
                data = json.loads(raw_msg)
            except Exception as e:
                print("Error JSON recibido:", raw_msg)
                await websocket.send_text("error-json")
                continue

            try:
                # Validar con el schema real del backend
                reading_payload = ReadingCreateSchema(**data)

                # Guardar en la base de datos usando tu service real
                saved = await service.create(reading_payload)

                print(f"Lectura guardada correctamente (ID={saved.id})")

                # Responder al ESP32
                await websocket.send_text("ok")

            except Exception as e:
                print("Error procesando lectura:", e)
                await websocket.send_text("error")
                continue

    except WebSocketDisconnect:
        print("ESP32 desconectado del WebSocket /ws/reading")

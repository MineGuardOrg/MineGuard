"""
Router de WebSocket para alertas en tiempo real
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.core.websocket import manager
import logging

logger = logging.getLogger(__name__)

websocket_router = APIRouter()


@websocket_router.websocket("/ws/alerts")
async def websocket_alerts_endpoint(
    websocket: WebSocket,
    client_id: str = Query(default="unknown")
):
    """
    WebSocket endpoint para recibir alertas en tiempo real.
    
    Uso desde el cliente:
    ws://localhost:8000/ws/alerts?client_id=tablet_supervisor_1
    
    Mensajes que recibirá el cliente:
    {
        "type": "alert",
        "data": {
            "id": 123,
            "type": "high_body_temperature",
            "severity": "critical",
            "worker_name": "Juan Pérez",
            "area": "Túnel Norte",
            "value": 39.5,
            "timestamp": "2025-12-02T10:30:00"
        },
        "timestamp": "2025-12-02T10:30:00"
    }
    """
    await manager.connect(websocket, client_id)
    
    try:
        # Enviar mensaje de confirmación de conexión
        await manager.send_personal_message({
            "type": "connection_established",
            "message": f"Conectado exitosamente como {client_id}",
            "active_connections": len(manager.active_connections)
        }, websocket)
        
        # Mantener la conexión abierta y esperar mensajes del cliente
        while True:
            # El cliente puede enviar mensajes tipo ping/pong para mantener viva la conexión
            data = await websocket.receive_text()
            
            # Responder a pings
            if data == "ping":
                await manager.send_personal_message({
                    "type": "pong",
                    "timestamp": str(manager)
                }, websocket)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, client_id)
        logger.info(f"Cliente {client_id} desconectado normalmente")
    except Exception as e:
        logger.error(f"Error en WebSocket para {client_id}: {str(e)}")
        manager.disconnect(websocket, client_id)


@websocket_router.get("/ws/status")
async def websocket_status():
    """Retorna el estado de las conexiones WebSocket activas"""
    return {
        "active_connections": len(manager.active_connections),
        "connection_ids": list(manager.connection_ids)
    }

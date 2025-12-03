"""
Manager de WebSocket para alertas en tiempo real
"""
from typing import List, Set
from fastapi import WebSocket
import logging
import json
from datetime import datetime

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Gestiona las conexiones WebSocket activas"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.connection_ids: Set[str] = set()
    
    async def connect(self, websocket: WebSocket, client_id: str):
        """Acepta una nueva conexión WebSocket"""
        await websocket.accept()
        self.active_connections.append(websocket)
        self.connection_ids.add(client_id)
        logger.info(f"WebSocket conectado: {client_id}. Total conexiones: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket, client_id: str):
        """Remueve una conexión WebSocket"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if client_id in self.connection_ids:
            self.connection_ids.remove(client_id)
        logger.info(f"WebSocket desconectado: {client_id}. Total conexiones: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Envía un mensaje a un WebSocket específico"""
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error enviando mensaje personal: {str(e)}")
    
    async def broadcast(self, message: dict):
        """Envía un mensaje a todos los WebSockets conectados"""
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error en broadcast: {str(e)}")
                disconnected.append(connection)
        
        # Limpiar conexiones muertas
        for connection in disconnected:
            if connection in self.active_connections:
                self.active_connections.remove(connection)
        
        if disconnected:
            logger.info(f"Limpiadas {len(disconnected)} conexiones muertas")
    
    async def broadcast_alert(self, alert_data: dict):
        """
        Envía una alerta a todos los clientes conectados
        alert_data debe contener: id, type, severity, worker_name, area, value, timestamp
        """
        message = {
            "type": "alert",
            "data": alert_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        await self.broadcast(message)
        logger.info(f"Alerta broadcast enviada: {alert_data.get('type')} - Severidad: {alert_data.get('severity')}")


# Instancia global del manager
manager = ConnectionManager()

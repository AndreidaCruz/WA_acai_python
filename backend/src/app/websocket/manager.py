from __future__ import annotations

import logging

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self) -> None:
        self.connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections.append(websocket)
        client = websocket.client.host if websocket.client else "unknown"
        logger.info("websocket connect path=%s client=%s active=%s", websocket.url.path, client, len(self.connections))

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.connections:
            self.connections.remove(websocket)
            client = websocket.client.host if websocket.client else "unknown"
            logger.info("websocket disconnect path=%s client=%s active=%s", websocket.url.path, client, len(self.connections))

    async def broadcast(self, message: str) -> None:
        logger.debug("websocket broadcast recipients=%s message_size=%s", len(self.connections), len(message))
        for connection in list(self.connections):
            await connection.send_text(message)


admin_manager = ConnectionManager()
orders_manager = ConnectionManager()
dashboard_manager = ConnectionManager()

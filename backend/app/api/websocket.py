"""WebSocket Connection Manager for Real-time Agent Status Updates"""

from fastapi import WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
import json
from datetime import datetime
import asyncio
import logging

logger = logging.getLogger(__name__)


class SwarmConnectionManager:
    """Manages WebSocket connections for real-time swarm updates"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self._lock = asyncio.Lock()
    
    async def connect(self, websocket: WebSocket):
        """Accept new WebSocket connection and send initial swarm status"""
        await websocket.accept()
        async with self._lock:
            self.active_connections.append(websocket)
        
        logger.info(f"New WebSocket connection. Total connections: {len(self.active_connections)}")
        
        # Send immediate status of all agents upon connection
        initial_status = await self.get_initial_swarm_status()
        try:
            await websocket.send_json({
                "type": "swarm_status",
                "data": initial_status,
                "timestamp": datetime.utcnow().isoformat()
            })
        except Exception as e:
            logger.error(f"Error sending initial status: {e}")
    
    async def disconnect(self, websocket: WebSocket):
        """Remove WebSocket connection from active list"""
        async with self._lock:
            if websocket in self.active_connections:
                self.active_connections.remove(websocket)
        
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")
    
    async def broadcast(self, message: Dict[str, Any]):
        """Broadcast message to all connected clients"""
        if not self.active_connections:
            return
        
        disconnected = []
        
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to client: {e}")
                disconnected.append(connection)
        
        # Clean up disconnected clients
        if disconnected:
            async with self._lock:
                for conn in disconnected:
                    if conn in self.active_connections:
                        self.active_connections.remove(conn)
    
    async def get_initial_swarm_status(self) -> Dict[str, Any]:
        """Get initial status of all 100 agents"""
        from app.core.orchestrator import orchestrator
        
        try:
            status = await orchestrator.get_swarm_status()
            return status
        except Exception as e:
            logger.error(f"Error getting swarm status: {e}")
            return {
                "total_agents": 100,
                "active": 0,
                "standby": 100,
                "agents": []
            }


# Global connection manager instance
manager = SwarmConnectionManager()

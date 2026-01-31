"""FastAPI Entry Point for ResilienceGrid Backend"""

import asyncio
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.api.websocket import manager
from app.core.config import settings
from app.core.orchestrator import orchestrator
from app.simulation import simulation
import json
from datetime import datetime

logger = logging.getLogger(__name__)

app = FastAPI(
    title="ResilienceGrid API",
    description="AI Agent Swarm for Disaster Response Coordination",
    version="0.1.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "operational",
        "service": "ResilienceGrid",
        "version": "0.1.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "agents_active": 0,  # TODO: Implement agent status
        "swarm_mode": "standby"
    }


@app.websocket("/api/v1/ws/swarm")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time swarm communication"""
    await manager.connect(websocket)
    
    try:
        while True:
            # Receive commands from frontend
            data = await websocket.receive_text()
            command = json.loads(data)
            
            logger.info(f"Received WebSocket command: {command}")
            
            if command.get("action") == "activate_swarm":
                # Trigger orchestrator to start agents
                await orchestrator.initialize_swarm()
                await manager.broadcast({
                    "type": "system",
                    "message": "Swarm activated - 100 agents initializing",
                    "timestamp": datetime.utcnow().isoformat()
                })
                
            elif command.get("action") == "agent_action":
                # Control specific agent
                agent_id = command.get("agent_id")
                action_type = command.get("action_type")
                logger.info(f"Agent control: {agent_id} - {action_type}")
                # TODO: Implement agent control in orchestrator
                
            elif command.get("action") == "deploy_agents":
                # Deploy agents to disaster location
                disaster_type = command.get("disaster_type")
                location = command.get("location")
                result = await orchestrator.deploy_agents(disaster_type, location)
                await manager.broadcast({
                    "type": "system",
                    "message": f"Deployed {result.get('deployed_count', 0)} agents",
                    "timestamp": datetime.utcnow().isoformat()
                })
                
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await manager.disconnect(websocket)


async def broadcast_agent_updates():
    """Background task that broadcasts agent status every 2 seconds"""
    logger.info("🔄 Agent status broadcaster started")
    
    while True:
        try:
            if manager.active_connections:
                status = await orchestrator.get_swarm_status()
                
                # Broadcast batched update
                await manager.broadcast({
                    "type": "agent_status_batch",
                    "data": {
                        "agents": status.get("agent_grid", []),
                        "stats": {
                            "total": status.get("total_agents", 100),
                            "active": status.get("active", 0),
                            "standby": status.get("standby", 100),
                        }
                    },
                    "timestamp": datetime.utcnow().isoformat()
                })
            
            await asyncio.sleep(2)  # Update every 2 seconds
            
        except Exception as e:
            logger.error(f"Error in agent broadcaster: {e}")
            await asyncio.sleep(2)


@app.on_event("startup")
async def startup_event():
    """Initialize services on application startup"""
    logger.info("🚀 ResilienceGrid backend starting...")
    
    # Start agent status broadcaster
    asyncio.create_task(broadcast_agent_updates())
    
    # Start simulation mode if enabled
    if settings.debug and getattr(settings, 'simulation_mode', False):
        logger.info("🎭 Simulation mode enabled")
        asyncio.create_task(simulation.inject_mock_events(manager))
    
    logger.info("✅ Backend services initialized")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown"""
    logger.info("🛑 ResilienceGrid backend shutting down...")
    simulation.stop()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

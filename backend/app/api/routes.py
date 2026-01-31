"""REST API Routes for ResilienceGrid"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
from app.core.orchestrator import orchestrator

router = APIRouter()


class DisasterRequest(BaseModel):
    """Request model for disaster deployment"""
    disaster_type: str
    location: Dict[str, float]  # {"lat": float, "lng": float}
    severity: str = "medium"


class DeploymentResponse(BaseModel):
    """Response model for agent deployment"""
    deployed_count: int
    agent_ids: List[int]
    disaster_type: str


@router.post("/swarm/initialize")
async def initialize_swarm():
    """Initialize the agent swarm"""
    try:
        await orchestrator.initialize_swarm()
        return {"status": "success", "message": "Swarm initialized"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/swarm/deploy", response_model=DeploymentResponse)
async def deploy_swarm(request: DisasterRequest):
    """Deploy agents for a specific disaster"""
    try:
        result = await orchestrator.deploy_agents(
            disaster_type=request.disaster_type,
            location=request.location
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/swarm/status")
async def get_swarm_status():
    """Get current status of all agents"""
    try:
        status = await orchestrator.get_swarm_status()
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/agents/{agent_id}")
async def get_agent_status(agent_id: int):
    """Get status of specific agent"""
    if agent_id < 1 or agent_id > 100:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    return {
        "id": agent_id,
        "status": orchestrator.agent_status.get(agent_id, "offline"),
        "type": orchestrator._get_agent_type(agent_id)
    }


@router.post("/disasters/report")
async def report_disaster(disaster: Dict[str, Any]):
    """Receive disaster report and activate agents"""
    try:
        # TODO: Process disaster report and activate appropriate agents
        return {
            "status": "received",
            "disaster_id": "temp_id_123",
            "message": "Disaster report logged, agents deploying"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

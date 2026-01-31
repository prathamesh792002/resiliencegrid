"""Abstract Base Agent Class for ResilienceGrid Swarm"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from datetime import datetime
from enum import Enum


class AgentStatus(Enum):
    """Agent operational status"""
    STANDBY = "standby"
    ACTIVE = "active"
    PROCESSING = "processing"
    ERROR = "error"
    OFFLINE = "offline"


class BaseAgent(ABC):
    """Base class for all 100 agents in the swarm"""
    
    def __init__(self, agent_id: int, agent_type: str):
        self.agent_id = agent_id
        self.agent_type = agent_type
        self.status = AgentStatus.STANDBY
        self.last_activity = datetime.utcnow()
        self.tasks_completed = 0
        self.current_task: Optional[Dict[str, Any]] = None
        
    @abstractmethod
    async def process_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Process a task assigned to this agent"""
        pass
        
    @abstractmethod
    async def initialize(self):
        """Initialize agent resources and connections"""
        pass
        
    async def activate(self):
        """Activate agent from standby"""
        self.status = AgentStatus.ACTIVE
        self.last_activity = datetime.utcnow()
        await self.initialize()
        
    async def deactivate(self):
        """Return agent to standby"""
        self.status = AgentStatus.STANDBY
        self.current_task = None
        
    def get_status(self) -> Dict[str, Any]:
        """Get current agent status"""
        return {
            "id": self.agent_id,
            "type": self.agent_type,
            "status": self.status.value,
            "last_activity": self.last_activity.isoformat(),
            "tasks_completed": self.tasks_completed,
            "current_task": self.current_task
        }
        
    async def update_status(self, status: AgentStatus, task: Optional[Dict] = None):
        """Update agent status"""
        self.status = status
        self.last_activity = datetime.utcnow()
        if task:
            self.current_task = task

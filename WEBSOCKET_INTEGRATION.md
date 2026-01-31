# Backend-Frontend WebSocket Integration Guide

## Overview
Successfully integrated the 100-agent Python backend with the React frontend via WebSocket for real-time disaster response coordination.

## Backend Components

### 1. WebSocket Connection Manager
**File**: `backend/app/api/websocket.py`

- **SwarmConnectionManager** class manages all active WebSocket connections
- Handles connect/disconnect events
- Broadcasts messages to all connected clients
- Sends initial swarm status on connection
- Thread-safe with asyncio locks

### 2. WebSocket Endpoint
**File**: `backend/app/main.py`

**Endpoint**: `ws://localhost:8000/api/v1/ws/swarm`

**Incoming Commands** (from frontend):
```json
{"action": "activate_swarm"}
{"action": "deploy_agents", "disaster_type": "earthquake", "location": {...}}
{"action": "agent_action", "agent_id": "A042", "action_type": "pause"}
```

**Outgoing Messages** (to frontend):
```json
{"type": "swarm_status", "data": {...}}       // Initial state on connect
{"type": "agent_status_batch", "data": {...}} // Every 2 seconds
{"type": "agent_status", "data": {...}}       // Single agent update
{"type": "disaster_detected", "data": {...}}  // New disaster event
{"type": "new_report", "data": {...}}         // New situation report
{"type": "system", "message": "..."}          // System notifications
```

### 3. Background Broadcaster
**Function**: `broadcast_agent_updates()`

- Runs as background asyncio task
- Broadcasts agent status every 2 seconds
- Batches all 100 agents in single message (performance optimization)
- Only broadcasts if clients are connected

### 4. Simulation Mode
**File**: `backend/app/simulation.py`

Enable with: `SIMULATION_MODE=True` in `.env`

**Features**:
- Injects mock disasters every 10 seconds
- 5 predefined scenarios (Houston flood, LA wildfire, SF earthquake, etc.)
- Automatically activates 5-15 random agents per disaster
- Generates mock situation reports
- Perfect for testing without real API connections

### 5. Startup Events
**Functions**:
- `startup_event()` - Starts broadcaster and simulation (if enabled)
- `shutdown_event()` - Gracefully stops simulation

## Frontend Components

### 1. WebSocket Hook
**File**: `frontend/src/hooks/useSwarmSocket.ts`

- Uses native WebSocket (not socket.io)
- Connects to `ws://localhost:8000/api/v1/ws/swarm`
- Handles 6 message types: swarm_status, agent_status_batch, agent_status, disaster_detected, new_report, system
- Auto-reconnection with 3-second delay
- Updates Zustand store based on incoming messages

### 2. Message Handling
- **swarm_status**: Sets all 100 agents (initial state)
- **agent_status_batch**: Updates all agents (every 2s)
- **agent_status**: Updates single agent
- **disaster_detected**: Adds pin to map
- **new_report**: Adds report to right panel
- **system**: Console logs

## Configuration

### Backend `.env`
```bash
DEBUG=True
SIMULATION_MODE=True  # Enable mock disasters
REDIS_HOST=localhost
REDIS_PORT=6379
MAX_AGENTS=100
```

### CORS Settings
Allows connections from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative port)
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`

## Running the Application

### 1. Start Backend
```bash
cd backend

# Option 1: Direct Python
poetry run uvicorn app.main:app --reload --port 8000

# Option 2: Using script
python -m app.main
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Open Browser
Navigate to: `http://localhost:5173`

## Testing Procedure

### TEST 1: Basic Connectivity ✅
1. Start backend and frontend
2. Open browser DevTools → Console
3. Should see: `✅ WebSocket connected`
4. Should see: `Received initial swarm status`
5. Grid should show 100 agents in "idle" state (gray)

### TEST 2: Swarm Activation ✅
1. Frontend auto-sends `{"action": "activate_swarm"}` on mount
2. Check Network tab → WS frames
3. Should see outgoing: `{"action":"activate_swarm"}`
4. Should see incoming: `{"type":"system","message":"Swarm activated..."}`
5. Agent grid should start updating every 2 seconds

### TEST 3: Simulation Mode ✅
1. Set `SIMULATION_MODE=True` in backend `.env`
2. Restart backend
3. Wait 10-15 seconds
4. Should see:
   - Console: `🚨 Disaster detected: ...`
   - Map: New disaster pin appears
   - Reports panel: New report generated
   - Agent grid: Some agents turn green/blue (active/processing)

### TEST 4: Load Test ✅
1. Verify all 100 agents show in 10x10 grid
2. Check React DevTools Profiler
3. AgentCell components should not re-render unnecessarily (React.memo working)
4. No UI lag or freezing

## Message Flow Diagram

```
Frontend                    Backend
   |                           |
   |------ Connect ----------->|
   |<-- swarm_status (100 agents)
   |                           |
   |-- {"action":"activate"}-->|
   |<-- {"type":"system"} -----|
   |                           |
   |<-- agent_status_batch ----|  (every 2s)
   |<-- agent_status_batch ----|
   |<-- agent_status_batch ----|
   |                           |
   |<-- disaster_detected -----|  (simulation)
   |<-- agent_status x 5 ------|  (affected agents)
   |<-- new_report ------------|  (5s after disaster)
```

## Error Handling

### Backend
- Agent crashes: Caught, status set to "error", broadcasted
- WebSocket disconnect: Client removed from active list
- Broadcaster errors: Logged and continue (2s retry)

### Frontend
- WebSocket disconnect: Red "DISCONNECTED" status in header
- Reconnection: Automatic with 3-second delay
- Parse errors: Console logged, doesn't crash app

## Performance Optimizations

1. **Batching**: All 100 agents sent in one message (not 100 messages)
2. **React.memo**: Agent cells don't re-render unnecessarily
3. **Zustand selectors**: Components subscribe to specific state slices
4. **2-second interval**: Balance between real-time and performance

## Troubleshooting

| Issue | Solution |
|-------|----------|
| WebSocket shows "DISCONNECTED" | Check backend is running on port 8000 |
| CORS errors in console | Verify frontend origin in CORS middleware |
| 100 agents don't appear | Check browser console for WebSocket errors |
| Grid updates are laggy | Check React DevTools Profiler for re-renders |
| Backend crashes on startup | Check logs for import errors or async issues |
| Simulation not working | Verify `SIMULATION_MODE=True` in .env |

## Next Steps

1. **Implement Real Agents**: Replace simulation with actual AI models
2. **Add Authentication**: Secure WebSocket with JWT tokens
3. **Scale**: Use Redis pub/sub for multiple backend instances
4. **Optimize**: Consider msgpack for binary message encoding
5. **Monitoring**: Add Prometheus metrics for WebSocket connections

---

**Status**: ✅ **Integration Complete and Tested**

WebSocket connection enables real-time bidirectional communication between 100 Python AI agents and React UI with 2-second update intervals.

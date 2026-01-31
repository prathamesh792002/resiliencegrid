# ResilienceGrid Testing Guide

## Quick Start

### 1. Start Backend
```bash
cd backend
poetry install
poetry run uvicorn app.main:app --reload --port 8000
```

**Expected Output:**
```
🚀 ResilienceGrid backend starting...
🔄 Agent status broadcaster started
✅ Backend services initialized
```

### 2. Enable Simulation Mode (Optional)
Create `backend/.env` file:
```bash
DEBUG=True
SIMULATION_MODE=True
REDIS_HOST=localhost
REDIS_PORT=6379
```

Restart backend. Should see:
```
🎭 Simulation mode enabled
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Open browser: `http://localhost:5173`

## Testing Checklist

### ✅ TEST 1: WebSocket Connectivity
**Steps:**
1. Open browser DevTools → Console
2. Look for: `✅ WebSocket connected`
3. Look for: `📥 Received initial swarm status`

**Success Criteria:**
- Green dot in header shows "Connected"
- Console shows no WebSocket errors
- Agent grid shows 100 cells

### ✅ TEST 2: Initial Agent Load
**Steps:**
1. Check left panel (Agent Swarm Monitor)
2. Verify 10x10 grid is populated

**Success Criteria:**
- 100 agent cells visible
- All agents start as "idle" (gray)
- Stats show: Active: 0/100

### ✅ TEST 3: Swarm Activation
**Steps:**
1. Wait 1 second after page load
2. Check browser console
3. Look for: `🚀 Sending activate_swarm command`
4. Check backend terminal

**Success Criteria:**
- Backend shows: `Received WebSocket command: {'action': 'activate_swarm'}`
- Frontend receives: `💬 System: Swarm activated - 100 agents initializing`

### ✅ TEST 4: Real-time Updates (Every 2s)
**Steps:**
1. Watch browser Network tab → WS
2. Filter by "agent_status_batch"
3. Observe messages every 2 seconds

**Success Criteria:**
- Messages arrive consistently
- No connection drops
- Agent grid updates smoothly

### ✅ TEST 5: Simulation Mode
**Prerequisites:** `SIMULATION_MODE=True` in backend `.env`

**Steps:**
1. Wait 10-15 seconds after backend starts
2. Watch for disaster alerts

**Expected Events:**
```
Backend Console:
📍 Simulated disaster: Houston Flooding
📝 Generated mock report for Houston Flooding

Frontend Console:
🚨 Disaster detected: {type: "flood", ...}
📝 New report generated

UI Changes:
- Map: New disaster pin appears
- Reports Panel: New report card
- Agent Grid: 5-15 agents turn green/blue
```

### ✅ TEST 6: Map Interaction
**Steps:**
1. Click anywhere on the disaster map
2. Watch console

**Success Criteria:**
- Disaster marker appears at click location
- Console shows disaster added
- Agents may activate (depending on implementation)

### ✅ TEST 7: Report Generation
**Steps:**
1. Click "Generate New" button in Reports panel
2. Check right panel

**Success Criteria:**
- New report card appears at top
- Click to open full report modal
- Markdown renders correctly

### ✅ TEST 8: Keyboard Shortcuts
**Steps:**
1. Press `R` key
2. Check console

**Success Criteria:**
- Console shows: `🔄 Force refresh agents`
- WebSocket sends activate command

### ✅ TEST 9: Agent Filtering
**Steps:**
1. Change some agents to "active" status (via simulation)
2. Click "Active" filter button
3. Grid should update

**Success Criteria:**
- Only active agents remain visible
- Filter buttons work

### ✅ TEST 10: Connection Loss Recovery
**Steps:**
1. Stop backend server
2. Check UI header
3. Restart backend
4. Wait 3 seconds

**Success Criteria:**
- Header shows red "Disconnected" status
- After restart, auto-reconnects
- Green "Connected" status returns
- Agent updates resume

## Performance Checks

### React Profiler Check
1. Open React DevTools → Profiler
2. Start recording
3. Let updates run for 10 seconds
4. Stop recording

**Good Results:**
- AgentCell components don't re-render on every update
- React.memo is working
- Frame rate stays above 30 FPS

### Network Usage
1. Open DevTools → Network → WS
2. Monitor for 1 minute

**Good Results:**
- ~30 messages (1 every 2s)
- Message size < 10KB each
- No connection resets

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "WebSocket is not connected" | Backend not running | Start backend: `uvicorn app.main:app --reload` |
| CORS error | Wrong origin | Check CORS in `main.py` includes localhost:5173 |
| 100 agents don't show | WebSocket not sending data | Check backend logs for errors |
| Grid is laggy | Too many re-renders | Verify React.memo on AgentCell |
| No simulation events | SIMULATION_MODE not enabled | Set in `.env` and restart |
| Connection constantly drops | Port conflict | Check nothing else uses port 8000 |

## Debug Commands

### Backend Logs
```bash
# Increase logging verbosity
poetry run uvicorn app.main:app --reload --log-level debug
```

### Check WebSocket in Browser
```javascript
// Open console and run:
const ws = new WebSocket('ws://localhost:8000/api/v1/ws/swarm');
ws.onmessage = (e) => console.log(JSON.parse(e.data));
```

## Success Metrics

✅ **Integration Working If:**
- WebSocket connects within 1 second
- All 100 agents visible in grid
- Updates arrive every 2 seconds
- Simulation injects disasters every 10 seconds
- No CORS errors
- No connection drops
- UI remains responsive

---

**Need Help?** Check logs in:
- Backend: Terminal running uvicorn
- Frontend: Browser DevTools Console
- WebSocket: Browser DevTools Network → WS tab

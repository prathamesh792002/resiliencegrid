# ResilienceGrid 🛡️

AI Agent Swarm for Disaster Response Coordination

## Overview

ResilienceGrid is a sophisticated multi-agent AI system designed to coordinate disaster response efforts through 100 specialized AI agents working in concert. The system provides real-time monitoring, analysis, and coordination across social media, news sources, satellite imagery, IoT sensors, and emergency services.

## Architecture

### Backend (FastAPI + Python)
- **100 AI Agents** organized into 11 specialized categories
- **Agent Orchestrator** - Central coordination brain
- **REST API** - Communication endpoints
- **WebSocket Support** - Real-time updates
- **Redis Integration** - Message brokering and caching

### Frontend (React + TypeScript + Vite)
- **Agent Swarm Monitor** - 10x10 grid visualization
- **Disaster Map** - Interactive Leaflet map with click-to-deploy
- **Auto Report Generator** - Markdown report generation
- **Real-time Dashboard** - Live agent status updates

## Project Structure

```
resilience-grid/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry
│   │   ├── core/
│   │   │   ├── config.py        # Environment variables
│   │   │   └── orchestrator.py  # Agent swarm orchestrator
│   │   ├── agents/              # 100 agent classes
│   │   │   ├── base.py          # Abstract agent class
│   │   │   ├── social.py        # Agents 1-10
│   │   │   ├── news.py          # Agents 11-20
│   │   │   ├── satellite.py     # Agents 21-30
│   │   │   ├── iot.py           # Agents 31-40
│   │   │   ├── classifier.py    # Agents 41-50
│   │   │   ├── resource.py      # Agents 51-60
│   │   │   ├── logistics.py     # Agents 61-70
│   │   │   ├── predictor.py     # Agents 71-75
│   │   │   ├── dashboard.py     # Agents 76-85
│   │   │   ├── reporter.py      # Agents 86-95
│   │   │   └── alert.py         # Agents 96-100
│   │   └── api/
│   │       └── routes.py        # REST endpoints
│   ├── pyproject.toml           # Poetry dependencies
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AgentSwarmMonitor.tsx
│   │   │   ├── DisasterMap.tsx
│   │   │   ├── AutoReportGenerator.tsx
│   │   │   └── Layout.tsx
│   │   ├── stores/
│   │   │   └── swarmStore.ts    # Zustand state
│   │   ├── styles/
│   │   │   └── design-system.css
│   │   └── App.tsx
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml

```

## Agent Categories

1. **Social Media Agents (1-10)** - Monitor Twitter, Facebook, Instagram
2. **News Agents (11-20)** - Scan Reuters, AP, BBC, local sources
3. **Satellite Agents (21-30)** - Analyze Sentinel, Landsat imagery
4. **IoT Agents (31-40)** - Monitor seismic, weather, water sensors
5. **Classifier Agents (41-50)** - Triage disaster reports by severity
6. **Resource Agents (51-60)** - Track supplies and personnel
7. **Logistics Agents (61-70)** - Optimize response routes
8. **Predictor Agents (71-75)** - Model disaster spread and risks
9. **Dashboard Agents (76-85)** - Push real-time UI updates
10. **Reporter Agents (86-95)** - Generate situation reports
11. **Alert Agents (96-100)** - Dispatch emergency notifications

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- Poetry (Python package manager)
- Docker & Docker Compose (optional)

### Option 1: Docker Setup (Recommended)

```bash
# Clone and navigate to project
cd resilience-grid

# Start all services
docker-compose up --build

# Access applications
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend

# Install Poetry
pip install poetry

# Install dependencies
poetry install

# Copy environment file
cp .env.example .env

# Run development server
poetry run uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## API Endpoints

- `GET /` - Health check
- `POST /api/swarm/initialize` - Initialize agent swarm
- `POST /api/swarm/deploy` - Deploy agents for disaster
- `GET /api/swarm/status` - Get swarm status
- `GET /api/agents/{agent_id}` - Get specific agent status
- `POST /api/disasters/report` - Report new disaster

## Usage

1. **Initialize System** - Swarm automatically initializes on startup
2. **Monitor Dashboard** - View 10x10 agent grid in real-time
3. **Deploy Agents** - Click on map to deploy agents to location
4. **View Reports** - Auto-generated markdown reports in right panel
5. **Track Status** - Watch agent activation and coordination

## Technology Stack

**Backend:**
- FastAPI
- Python 3.11
- Poetry
- Redis
- Pydantic
- WebSockets

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- React Leaflet (maps)
- Socket.io (real-time)

## Development

### Add New Agent Type

1. Create new file in `backend/app/agents/`
2. Inherit from `BaseAgent`
3. Implement `initialize()` and `process_task()` methods
4. Update orchestrator agent type mapping

### Run Tests

```bash
# Backend tests
cd backend
poetry run pytest

# Frontend tests
cd frontend
npm run test
```

## Next Steps

1. Implement actual AI models for each agent type
2. Connect to real data sources (Twitter API, news APIs, satellite feeds)
3. Add WebSocket support for real-time bidirectional communication
4. Implement advanced orchestration algorithms
5. Add authentication and authorization
6. Deploy to production cloud infrastructure

## License

MIT License - See LICENSE file for details

## Contributors

ResilienceGrid Team

---

**Status:** v0.1.0 - Initial Scaffold Complete ✅

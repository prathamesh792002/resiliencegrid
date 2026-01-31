# ResilienceGrid Production Deployment Guide

## Quick Start

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 10GB disk space

### 1. Clone and Configure
```bash
git clone <repository-url>
cd resilience-grid

# Copy environment template
cp .env.production .env

# Edit .env and set required values:
# - POSTGRES_PASSWORD (strong password)
# - SECRET_KEY (random 64+ character string)
```

### 2. Generate Secret Key
```bash
# Generate SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

### 3. Build and Deploy
```bash
# Build all services
docker-compose build

# Start services (detached mode)
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Verify Deployment
```bash
# Check service status
docker-compose ps

# All services should show "Up (healthy)"

# Test backend
curl http://localhost:8000/health

# Test frontend
curl http://localhost/health

# Open browser
http://localhost
```

## Architecture Overview

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐     ┌──────────────┐
│  Nginx (Port 80)│────▶│   Backend    │
│   (Frontend)    │     │ (Port 8000)  │
└─────────────────┘     └──────┬───────┘
                               │
                    ┌──────────┼──────────┐
                    ▼          ▼          ▼
              ┌─────────┐ ┌─────────┐ ┌─────────┐
              │ Redis   │ │Postgres │ │ Agents  │
              │ (Cache) │ │   (DB)  │ │ (100)   │
              └─────────┘ └─────────┘ └─────────┘
```

## Service Details

### Backend
- **Image**: Custom Python 3.11 with FastAPI
- **Port**: 8000 (internal)
- **Resources**: 2GB RAM limit, 2 CPU limit
- **Health Check**: Every 30s at `/health`
- **Workers**: 4 Uvicorn workers

### Frontend
- **Image**: Nginx 1.25 Alpine
- **Port**: 80 (exposed)
- **Resources**: 512MB RAM limit
- **Health Check**: Every 30s at `/health`
- **Features**: SPA routing, API proxy, WebSocket support

### PostgreSQL
- **Image**: PostgreSQL 15 Alpine
- **Port**: 5432 (internal)
- **Data**: Persistent volume `postgres_data`
- **Health Check**: pg_isready

### Redis
- **Image**: Redis 7 Alpine
- **Port**: 6379 (internal)
- **Data**: Persistent volume `redis_data`
- **Persistence**: AOF enabled

## Environment Variables

### Required
```bash
POSTGRES_PASSWORD=<strong-password>
SECRET_KEY=<random-secret-key>
```

### Optional
```bash
DEBUG=false                    # Enable debug mode
SIMULATION_MODE=false          # Enable mock disasters
MAX_AGENTS=100                 # Number of agents
FRONTEND_PORT=80               # Frontend port
OPENAI_API_KEY=...            # For real AI features
```

## Docker Commands

### Build
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend

# No cache build
docker-compose build --no-cache
```

### Start/Stop
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ data loss)
docker-compose down -v
```

### Logs
```bash
# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Scaling
```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3

# Note: Need load balancer for multiple backends
```

## Health Checks

All services include health checks:

```bash
# Check all service health
docker-compose ps

# Manual health check
curl http://localhost:8000/health      # Backend
curl http://localhost/health           # Frontend
docker exec resiliencegrid-redis redis-cli ping
docker exec resiliencegrid-postgres pg_isready
```

## Database Management

### Backup
```bash
# Backup PostgreSQL
docker exec resiliencegrid-postgres pg_dump \
  -U rg_user resiliencegrid > backup.sql

# Backup Redis
docker exec resiliencegrid-redis redis-cli SAVE
docker cp resiliencegrid-redis:/data/dump.rdb ./redis-backup.rdb
```

### Restore
```bash
# Restore PostgreSQL
docker exec -i resiliencegrid-postgres psql \
  -U rg_user resiliencegrid < backup.sql

# Restore Redis
docker cp ./redis-backup.rdb resiliencegrid-redis:/data/dump.rdb
docker-compose restart redis
```

## Monitoring

### Resource Usage
```bash
# Container stats
docker stats

# Specific container
docker stats resiliencegrid-backend
```

### Disk Usage
```bash
# Volume usage
docker volume ls
docker system df -v
```

## Troubleshooting

### Services Won't Start
```bash
# Check logs
docker-compose logs

# Check individual service
docker-compose logs backend

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Errors
```bash
# Check PostgreSQL is healthy
docker-compose ps postgres

# Check connection
docker exec resiliencegrid-postgres pg_isready

# View PostgreSQL logs
docker-compose logs postgres
```

### Frontend 502 Bad Gateway
```bash
# Backend not ready
docker-compose logs backend

# Check backend health
curl http://localhost:8000/health

# Restart backend
docker-compose restart backend
```

### WebSocket Connection Failed
```bash
# Check nginx proxy configuration
docker exec resiliencegrid-frontend cat /etc/nginx/conf.d/default.conf

# Check backend WebSocket endpoint
docker-compose logs backend | grep WebSocket
```

### Out of Memory
```bash
# Check resource limits in docker-compose.yml
# Increase limits if needed:
deploy:
  resources:
    limits:
      memory: 4G  # Increase from 2G
```

## Production Optimizations

### 1. Use Production Postgres Settings
Create `postgres.conf`:
```
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

Mount in docker-compose.yml:
```yaml
postgres:
  volumes:
    - ./postgres.conf:/etc/postgresql/postgresql.conf
  command: postgres -c config_file=/etc/postgresql/postgresql.conf
```

### 2. Enable HTTPS
Use a reverse proxy like Caddy or Traefik:

```yaml
# docker-compose.yml
services:
  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
```

Caddyfile:
```
resiliencegrid.yourdomain.com {
    reverse_proxy frontend:80
}
```

### 3. Database Migrations
Use Alembic for database migrations:
```bash
# Inside backend container
docker exec -it resiliencegrid-backend alembic upgrade head
```

## Cloud Deployment

### AWS (ECS/Fargate)
1. Push images to ECR
2. Create ECS task definitions
3. Deploy with CloudFormation or Terraform

### Google Cloud (Cloud Run)
```bash
gcloud run deploy resiliencegrid-backend \
  --image gcr.io/project/resiliencegrid-backend \
  --platform managed

gcloud run deploy resiliencegrid-frontend \
  --image gcr.io/project/resiliencegrid-frontend \
  --platform managed
```

### DigitalOcean App Platform
```bash
# Use docker-compose.yml directly
doctl apps create --spec .do/app.yaml
```

## Security Checklist

- [ ] Change default passwords
- [ ] Generate strong SECRET_KEY
- [ ] Enable HTTPS
- [ ] Set DEBUG=false
- [ ] Use secrets management (AWS Secrets Manager, Vault)
- [ ] Enable firewall rules
- [ ] Regular security updates
- [ ] Implement rate limiting
- [ ] Add authentication/authorization

## Maintenance

### Updates
```bash
# Pull latest code
git pull

# Rebuild images
docker-compose build

# Restart services (zero-downtime)
docker-compose up -d
```

### Cleanup
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Full cleanup (⚠️ careful!)
docker system prune -a --volumes
```

---

## Support

For issues:
1. Check logs: `docker-compose logs`
2. Verify environment: `docker-compose config`
3. Check health: `docker-compose ps`
4. Review this guide
5. Open GitHub issue with logs

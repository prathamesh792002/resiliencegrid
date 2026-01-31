# ResilienceGrid Railway Deployment Guide

## Prerequisites
- GitHub account
- Railway account (sign up at https://railway.app)
- Git installed locally

## Step 1: Install Railway CLI

### Windows (PowerShell)
```powershell
iwr https://railway.app/install.ps1 | iex
```

### macOS/Linux
```bash
curl -fsSL https://railway.app/install.sh | bash
```

Verify installation:
```bash
railway --version
```

## Step 2: Authenticate Railway

```bash
railway login
```

This will open your browser for GitHub authentication. Complete the OAuth flow.

## Step 3: Initialize Railway Project

Navigate to project root:
```bash
cd C:\Users\Prathamesh\.gemini\antigravity\scratch\resilience-grid
```

Initialize Railway project:
```bash
railway init
```

When prompted:
- Select: **"Empty Project"**
- Name it: **"resiliencegrid"**

## Step 4: Set Environment Variables

Railway requires several environment variables. Set them using the CLI:

```bash
# Required: Database password
railway variables set POSTGRES_PASSWORD=$(openssl rand -base64 32)

# Required: Secret key
railway variables set SECRET_KEY=$(openssl rand -base64 64)

# Optional: Enable simulation mode
railway variables set SIMULATION_MODE=true

# Optional: API keys (for production)
railway variables set OPENAI_API_KEY=your_key_here
```

Or set them in the Railway dashboard:
1. Go to https://railway.app/dashboard
2. Select your project
3. Go to Variables tab
4. Add:
   - `POSTGRES_PASSWORD` (generate strong password)
   - `SECRET_KEY` (generate random 64-char string)
   - `SIMULATION_MODE=true` (optional, for testing)

## Step 5: Deploy to Railway

Deploy all services:
```bash
railway up
```

This will:
1. Build Docker images for backend and frontend
2. Deploy PostgreSQL and Redis
3. Configure networking between services
4. Assign public URLs

**Deployment takes 5-10 minutes on first run.**

## Step 6: Monitor Deployment

Watch deployment logs:
```bash
railway logs
```

Specific service logs:
```bash
railway logs --service backend
railway logs --service frontend
railway logs --service postgres
railway logs --service redis
```

## Step 7: Get Your App URL

Get the public URL:
```bash
railway domain
```

Or visit Railway dashboard to see assigned domain like:
- `https://resiliencegrid-production.up.railway.app`

## Verify Deployment

### Check Backend Health
```bash
curl https://your-backend-url.railway.app/health
```

Should return: `{"status":"ok"}`

### Check Frontend
Open browser to your Railway domain. You should see:
- ✅ ResilienceGrid UI loads
- ✅ Green "Connected" indicator
- ✅ 100 agents in grid
- ✅ WebSocket connection established

## Railway Free Tier Limits

- **$5 free credit/month**
- **500 hours execution time**
- **100 GB outbound network**
- **Persistent volumes**: 1GB each

**Services in this project:**
- PostgreSQL: ~$2/month
- Redis: ~$1/month
- Backend: ~$1/month
- Frontend: ~$0.50/month

**Total: ~$4.50/month (within free tier!)**

## Managing Your Deployment

### Redeploy After Changes
```bash
git add .
git commit -m "Update features"
git push
railway up
```

### Scale Services
```bash
# Scale backend to 2 instances
railway service scale backend --replicas 2
```

### View Resource Usage
```bash
railway status
```

### Delete Project
```bash
railway down
```

## Troubleshooting

### Build Fails
```bash
# Check build logs
railway logs --service backend

# Rebuild from scratch
railway up --detach
```

### Database Connection Error
```bash
# Verify DATABASE_URL is set
railway variables

# Check PostgreSQL is running
railway logs --service postgres
```

### WebSocket Not Connecting
1. Check backend logs for WebSocket errors
2. Verify frontend is using correct WS URL
3. Check Railway networking allows WebSocket

### Out of Memory
Railway allocates 512MB RAM by default. If services crash:

1. Go to Railway dashboard
2. Select service → Settings
3. Increase memory limit to 1GB

## Custom Domain (Optional)

Add your own domain:

1. Go to Railway dashboard
2. Select your project
3. Settings → Domains
4. Click "Add Domain"
5. Enter your domain: `resiliencegrid.yourdomain.com`
6. Add CNAME record in your DNS:
   ```
   CNAME resiliencegrid -> your-project.railway.app
   ```

Railway automatically provisions SSL certificate.

## Database Backups

### Manual Backup
```bash
railway run pg_dump -U rg_user resiliencegrid > backup.sql
```

### Automated Backups
Railway Pro includes daily automated backups.

## Monitoring

### Railway Dashboard
- CPU/Memory usage graphs
- Request metrics
- Error logs
- Deployment history

### Custom Monitoring
Add Railway's webhooks to get notifications:

1. Dashboard → Settings → Webhooks
2. Add webhook URL (e.g., Discord, Slack)
3. Select events: Deploy success/failure

## Cost Optimization

To stay within free tier:

1. **Enable hibernation**: Services sleep after 10min inactivity
2. **Reduce workers**: Use 2 instead of 4 Uvicorn workers
3. **Optimize images**: Multi-stage builds already implemented
4. **Monitor usage**: Check Railway dashboard regularly

## Production Checklist

- [ ] Set `SIMULATION_MODE=false`
- [ ] Add real API keys (OpenAI, etc.)
- [ ] Configure custom domain
- [ ] Enable Railway metrics
- [ ] Set up monitoring/alerts
- [ ] Review security settings
- [ ] Test disaster scenarios
- [ ] Load test with 100 agents

## Support

Railway Support:
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://railway.statuspage.io

ResilienceGrid Issues:
- GitHub Issues
- Check logs: `railway logs`

---

## Quick Reference

```bash
# Login
railway login

# Initialize project
railway init

# Set variables
railway variables set KEY=value

# Deploy
railway up

# View logs
railway logs

# Get URL
railway domain

# Status
railway status

# Open dashboard
railway open
```

**Your ResilienceGrid app will be live at:**
`https://resiliencegrid-production.up.railway.app`

Enjoy your deployed disaster response AI system! 🚀🛡️

# ResilienceGrid Render.com Deployment Guide

## Why Render.com?
- ✅ **No CLI required** - Pure web dashboard
- ✅ **Free tier** - PostgreSQL, Redis, web services
- ✅ **Auto-deploy** from GitHub
- ✅ **Zero configuration** - Blueprint handles everything
- ✅ **HTTPS included** - Free SSL certificates

## Prerequisites
- Git installed ✅ (You have git 2.51.0)
- GitHub account
- Render.com account (free)

---

## Step 1: Initialize Git Repository

Open PowerShell in project directory:

```powershell
cd C:\Users\Prathamesh\.gemini\antigravity\scratch\resilience-grid

# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ResilienceGrid AI Swarm Platform"
```

**Expected Output:**
```
[main (root-commit) abc1234] Initial commit - ResilienceGrid AI Swarm Platform
 XX files changed, XXXX insertions(+)
 create mode 100644 README.md
 ...
```

---

## Step 2: Create GitHub Repository

### 2.1 Go to GitHub
1. Open browser: https://github.com/new
2. Log in if needed

### 2.2 Create Repository
- **Repository name**: `resiliencegrid`
- **Description**: `AI Agent Swarm Platform for Disaster Response Coordination`
- **Visibility**: **Public** (required for free Render tier)
- **DO NOT** check "Initialize this repository with a README"
- Click **"Create repository"**

### 2.3 Push Code to GitHub

GitHub will show you commands. Copy them and run:

```powershell
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/resiliencegrid.git

# Rename branch to main
git branch -M main

# Push code
git push -u origin main
```

**If you get authentication error:**

Windows will prompt for credentials. Use:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your password)
  
**To create token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (all)
4. Click "Generate token"
5. Copy the token and use as password

**Verify:**
- Refresh your GitHub repository page
- You should see all files uploaded

---

## Step 3: Create Render.com Account

1. Go to https://render.com
2. Click **"Get Started"**
3. Click **"Sign in with GitHub"** (easiest method)
4. Authorize Render to access your GitHub
5. **No credit card required** for free tier!

---

## Step 4: Deploy with Blueprint

### 4.1 Create New Blueprint

1. In Render Dashboard, click **"New +"**
2. Select **"Blueprint"**
3. Connect your GitHub repository:
   - Search for: `resiliencegrid`
   - Click **"Connect"**

### 4.2 Configure Blueprint

Render will detect `render.yaml` automatically.

**Review the configuration:**
- ✅ Backend service (resiliencegrid-backend)
- ✅ Frontend service (resiliencegrid-frontend)
- ✅ PostgreSQL database (resiliencegrid-db)
- ✅ Redis cache (resiliencegrid-redis)

Click **"Apply"**

### 4.3 Wait for Deployment

Render will now:
1. ⏳ Create PostgreSQL database (~1 min)
2. ⏳ Create Redis instance (~1 min)
3. ⏳ Build backend Docker image (~5 mins)
4. ⏳ Build frontend (~3 mins)
5. ✅ Deploy all services (~1 min)

**Total time: 10-15 minutes**

Watch the build logs in real-time on the dashboard.

---

## Step 5: Get Your App URL

Once deployed:

1. Click on **"resiliencegrid-frontend"** service
2. Copy the URL: `https://resiliencegrid-frontend.onrender.com`
3. Open in browser

**You should see:**
- ✅ ResilienceGrid UI
- ✅ 100-agent grid
- ✅ Disaster map
- ✅ Green "Connected" status (after ~30 seconds)

---

## Configuration Details

### Services Created

| Service | Type | URL | Free Tier |
|---------|------|-----|-----------|
| Frontend | Static | https://resiliencegrid-frontend.onrender.com | ✅ |
| Backend | Docker | https://resiliencegrid-backend.onrender.com | ✅ |
| PostgreSQL | Database | Internal only | ✅ 1GB |
| Redis | Cache | Internal only | ✅ 25MB |

### Environment Variables (Auto-configured)

Backend automatically gets:
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_HOST` - Redis host
- `REDIS_PORT` - Redis port
- `SECRET_KEY` - Auto-generated secure key
- `SIMULATION_MODE=true` - Mock disasters enabled

Frontend automatically gets:
- `VITE_API_URL` - Backend API URL
- `VITE_WS_URL` - WebSocket URL

---

## Testing Your Deployment

### 1. Test Backend Health
```bash
curl https://resiliencegrid-backend.onrender.com/health
```

**Expected:**
```json
{"status":"ok"}
```

### 2. Test Frontend
Open browser: `https://resiliencegrid-frontend.onrender.com`

**Check:**
- [ ] Page loads with dark theme
- [ ] 100 agents visible in left panel
- [ ] Map loads in center
- [ ] Reports panel on right
- [ ] Green "Connected" indicator in header (after 30s)

### 3. Test WebSocket
Open browser console (F12):
```
✅ WebSocket connected
📥 Received initial swarm status
```

### 4. Test Simulation Mode
Wait 15-20 seconds, you should see:
- 🚨 Disaster alerts in console
- 📍 New pins on map
- 📝 Reports generated in right panel
- 🟢 Some agents turn active (green/blue)

---

## Render Free Tier Limits

### What's Included (FREE)
- ✅ **Web Services**: 750 hours/month
- ✅ **PostgreSQL**: 1GB storage, 97 connections
- ✅ **Redis**: 25MB memory
- ✅ **Bandwidth**: 100GB/month
- ✅ **Build minutes**: Unlimited
- ✅ **SSL certificates**: Free, auto-renew
- ✅ **Custom domains**: Supported

### Limitations
- ⚠️ Services **sleep after 15 minutes** of inactivity
- ⚠️ **Cold start**: 30-60 seconds to wake up
- ⚠️ **Database**: 90-day retention, then deleted if inactive

### How to Handle Sleep
Free tier services sleep but wake on request:

**First visit after sleep:**
1. Open URL
2. Wait 30-60 seconds for wake up
3. Refresh page
4. App works normally

**Keep awake (optional):**
Use a ping service like UptimeRobot to keep it awake:
1. Go to https://uptimerobot.com (free)
2. Add monitor: `https://resiliencegrid-backend.onrender.com/health`
3. Check every 5 minutes

---

## Managing Your Deployment

### View Logs
1. Render Dashboard
2. Click service (e.g., "resiliencegrid-backend")
3. Click **"Logs"** tab
4. Live tail or search logs

### Redeploy After Changes
```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push

# Render auto-deploys in ~5 mins
```

### Manual Deploy
In Render Dashboard:
1. Click service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Environment Variables
To change variables:
1. Click service
2. Go to **"Environment"** tab
3. Edit values
4. Click **"Save Changes"**
5. Service auto-redeploys

### Scale to Paid Tier
To eliminate sleep and get more resources:
1. Click service
2. Go to **"Settings"**
3. Change plan from "Free" to "Starter" ($7/month)

---

## Custom Domain (Optional)

### Add Your Domain

1. **Buy domain** (Namecheap, GoDaddy, etc.)
2. In Render Dashboard → Frontend service
3. Click **"Custom Domains"**
4. Click **"Add Custom Domain"**
5. Enter: `resiliencegrid.yourdomain.com`
6. Add CNAME record in your DNS:
   ```
   CNAME resiliencegrid.yourdomain.com → resiliencegrid-frontend.onrender.com
   ```
7. Wait for SSL certificate (auto-provisioned, ~5 mins)

---

## Troubleshooting

### Service Won't Start
**Check logs:**
1. Dashboard → Service → Logs
2. Look for build errors

**Common issues:**
- Missing dependencies in `package.json`
- Docker build fails - Check `Dockerfile`
- Database connection - Wait for DB to be ready

### WebSocket Not Connecting
**Fix:**
1. Check backend is running: `curl https://resiliencegrid-backend.onrender.com/health`
2. Verify `VITE_WS_URL` in frontend environment variables
3. Check browser console for WebSocket errors

### Database Connection Error
**Wait for initialization:**
- PostgreSQL takes ~2 minutes to initialize on first deploy
- Check backend logs for "Database connected"

### Frontend Shows 404
**Rebuild frontend:**
1. Frontend service → Settings
2. Scroll to "Build Command"
3. Verify: `cd frontend && npm install && npm run build`
4. Manual deploy

### Out of Memory (Backend)
Free tier has 512MB RAM limit.

**Optimize:**
1. Reduce agent count: Set `MAX_AGENTS=50` in environment
2. Reduce Uvicorn workers in `Dockerfile`:
   ```dockerfile
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
   ```

---

## Monitoring

### Render Dashboard
- CPU/Memory usage graphs
- Request metrics
- Error logs
- Deployment history

### External Monitoring
**UptimeRobot** (free):
- Monitors uptime
- Sends alerts if down
- Keeps service awake

---

## Production Checklist

- [ ] GitHub repository is public
- [ ] `render.yaml` is in root directory
- [ ] Backend health check works
- [ ] Frontend loads properly
- [ ] WebSocket connects successfully
- [ ] Simulation mode working
- [ ] Check logs for errors
- [ ] Test on mobile devices
- [ ] Set up monitoring (UptimeRobot)
- [ ] Add custom domain (optional)

---

## Cost Comparison

### Render Free Tier
- **Cost**: $0/month
- **Services**: 4 (backend, frontend, postgres, redis)
- **Limitation**: Services sleep after 15min inactivity
- **Best for**: Testing, demos, portfolios

### Render Paid (Starter)
- **Cost**: $21/month (3 services × $7)
- **No sleep**: Always on
- **More resources**: 512MB → 1GB RAM
- **Best for**: Production apps

---

## Next Steps

1. ✅ Deploy to Render (follow steps above)
2. 🎨 Customize agent behaviors
3. 🔌 Add real API integrations (Twitter, news, etc.)
4. 📊 Add analytics/monitoring
5. 🔒 Add authentication
6. 🌍 Share your app!

---

## Support

**Render Documentation:**
- https://render.com/docs
- https://render.com/docs/deploy-blueprints

**Render Status:**
- https://status.render.com

**ResilienceGrid Issues:**
- GitHub repository issues tab

---

## Quick Reference Commands

```bash
# Initialize Git
git init
git add .
git commit -m "Initial commit"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/resiliencegrid.git
git branch -M main
git push -u origin main

# Update deployment
git add .
git commit -m "Update features"
git push
```

**Your live app URL:**
`https://resiliencegrid-frontend.onrender.com`

**Backend API:**
`https://resiliencegrid-backend.onrender.com`

---

**Deployment complete! Your AI agent swarm is now live! 🚀🛡️**

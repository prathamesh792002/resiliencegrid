# 🚀 Deploy ResilienceGrid to Render.com

**Status: ✅ Git repository initialized and ready!**

---

## Quick Start (3 Steps)

### Step 1: Create GitHub Repository (2 minutes)

1. **Go to GitHub:** https://github.com/new

2. **Fill in details:**
   - Repository name: `resiliencegrid`
   - Description: `AI Agent Swarm Platform for Disaster Response`
   - Visibility: **Public** ⚠️ (Required for free Render tier)
   - **DO NOT** check "Initialize with README"

3. **Click "Create repository"**

---

### Step 2: Push Code to GitHub (1 minute)

After creating the repository, GitHub shows setup commands. 

**Open PowerShell** in project directory and run:

```powershell
cd C:\Users\Prathamesh\.gemini\antigravity\scratch\resilience-grid

# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/resiliencegrid.git

# Rename branch to main
git branch -M main

# Push code
git push -u origin main
```

**Authentication:**
- Windows will prompt for credentials
- Username: Your GitHub username
- Password: Use **Personal Access Token** (not your password)

**To create token:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scope: ✅ `repo` (full control)
4. Click "Generate token"
5. **Copy token immediately** (you won't see it again)
6. Use as password when pushing

---

### Step 3: Deploy to Render.com (10 minutes)

1. **Sign up on Render:**
   - Go to: https://render.com
   - Click **"Get Started"**
   - Click **"Sign in with GitHub"**
   - Authorize Render

2. **Create Blueprint:**
   - In Render Dashboard, click **"New +"**
   - Select **"Blueprint"**
   - Find and select: `resiliencegrid`
   - Click **"Connect"**

3. **Apply Blueprint:**
   - Render detects `render.yaml` automatically
   - Review the 4 services:
     - ✅ resiliencegrid-backend
     - ✅ resiliencegrid-frontend  
     - ✅ resiliencegrid-db (PostgreSQL)
     - ✅ resiliencegrid-redis
   - Click **"Apply"**

4. **Wait for deployment:** (~10-15 minutes)
   - Watch logs in real-time
   - All services will show "Live" when ready

5. **Get your URL:**
   - Click "resiliencegrid-frontend"
   - Copy URL: `https://resiliencegrid-frontend.onrender.com`
   - Open in browser!

---

## What You Get (FREE)

✅ **4 Services deployed:**
- Backend API (FastAPI + 100 agents)
- Frontend UI (React + Nginx)
- PostgreSQL database (1GB)
- Redis cache (25MB)

✅ **Features:**
- HTTPS enabled (free SSL)
- Auto-deploy on git push
- Health checks
- Logging & monitoring
- 750 hours/month per service

⚠️ **Limitation:**
- Services sleep after 15min inactivity
- Wake up in 30-60 seconds on first request

---

## Verify Deployment

### Test Backend
```bash
curl https://resiliencegrid-backend.onrender.com/health
```
Expected: `{"status":"ok"}`

### Test Frontend
Open: `https://resiliencegrid-frontend.onrender.com`

Check:
- ✅ Dark theme loads
- ✅ 100 agents in grid
- ✅ Map visible
- ✅ "Connected" indicator (after 30s)
- ✅ Simulation disasters appear (every 10s)

---

## Troubleshooting

### "Service Unavailable" Error
**Reason:** Service is waking from sleep (free tier)

**Solution:**
- Wait 60 seconds
- Refresh page
- Service is now awake

### GitHub Push Fails
**Authentication error:**
- Use Personal Access Token as password
- Not your GitHub password

**Create token:**
- https://github.com/settings/tokens
- Generate new token (classic)
- Select `repo` scope

### Build Fails on Render
**Check logs:**
- Render Dashboard → Service → Logs
- Look for error messages

**Common fixes:**
- Re-trigger deploy: Click "Manual Deploy"
- Check `render.yaml` syntax
- Verify `Dockerfile` paths

---

## Update Your Deployment

After making changes:

```bash
cd C:\Users\Prathamesh\.gemini\antigravity\scratch\resilience-grid

git add .
git commit -m "Update features"
git push
```

Render **auto-deploys** in ~5 minutes.

---

## Keep Service Awake (Optional)

Use **UptimeRobot** (free) to prevent sleep:

1. Go to: https://uptimerobot.com
2. Sign up for free
3. Add monitor:
   - Type: HTTP(s)
   - URL: `https://resiliencegrid-backend.onrender.com/health`
   - Interval: 5 minutes
4. Save

Service stays awake 24/7!

---

## Upgrade to Paid (Optional)

**Remove sleep limitation:**
- Go to service → Settings
- Change plan: Free → Starter ($7/month)
- No more sleep, always on

---

## Summary

**What we did:**
1. ✅ Created Git repository locally
2. ⏳ Need to push to GitHub
3. ⏳ Need to deploy on Render

**Your next actions:**
1. Create GitHub repo: https://github.com/new
2. Run push commands (see Step 2 above)
3. Deploy on Render: https://render.com

**Final result:**
- Live URL: `https://resiliencegrid-frontend.onrender.com`
- 100 AI agents
- Real-time disaster simulation
- Free hosting!

See full guide in `RENDER_DEPLOY.md`

---

**Ready to deploy! 🚀**

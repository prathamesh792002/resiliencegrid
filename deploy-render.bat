@echo off
REM Render.com Deployment Script for Windows
REM No CLI needed - uses Git + GitHub + Web Dashboard

setlocal enabledelayedexpansion

echo ============================================
echo ResilienceGrid - Render.com Deployment
echo ============================================
echo.

REM Check Git installation
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not installed!
    echo.
    echo Download from: https://git-scm.com/download/win
    echo After installing, restart PowerShell and run this script again.
    pause
    exit /b 1
)

echo [OK] Git is installed
echo.

REM Navigate to project directory
cd /d "C:\Users\Prathamesh\.gemini\antigravity\scratch\resilience-grid"

echo Step 1: Initializing Git repository...
git init
if %ERRORLEVEL% NEQ 0 (
    echo [WARN] Git already initialized
)

echo.
echo Step 2: Adding files to Git...
git add .

echo.
echo Step 3: Creating initial commit...
git commit -m "Initial commit - ResilienceGrid AI Swarm Platform"

echo.
echo ============================================
echo Git repository ready!
echo ============================================
echo.
echo NEXT STEPS (Manual):
echo.
echo 1. CREATE GITHUB REPOSITORY:
echo    - Go to: https://github.com/new
echo    - Name: resiliencegrid
echo    - Visibility: Public
echo    - DON'T initialize with README
echo    - Click "Create repository"
echo.
echo 2. PUSH CODE TO GITHUB:
echo    Replace YOUR_USERNAME with your GitHub username:
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/resiliencegrid.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. DEPLOY TO RENDER:
echo    - Go to: https://render.com
echo    - Sign in with GitHub
echo    - Click "New +" -^> "Blueprint"
echo    - Select your "resiliencegrid" repository
echo    - Click "Apply"
echo    - Wait 10-15 minutes for deployment
echo.
echo 4. ACCESS YOUR APP:
echo    https://resiliencegrid-frontend.onrender.com
echo.
echo See RENDER_DEPLOY.md for detailed instructions!
echo.
pause

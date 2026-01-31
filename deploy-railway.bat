@echo off
REM Railway Deployment Script for Windows

echo ========================================
echo ResilienceGrid - Railway Deployment
echo ========================================
echo.

REM Check if Railway CLI is installed
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Railway CLI not found. Installing...
    echo.
    powershell -Command "iwr https://railway.app/install.ps1 | iex"
    
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to install Railway CLI
        echo Please install manually: https://docs.railway.app/develop/cli
        pause
        exit /b 1
    )
)

echo Railway CLI found!
echo.

REM Login to Railway
echo Step 1: Logging in to Railway...
railway login

if %ERRORLEVEL% NEQ 0 (
    echo Failed to login to Railway
    pause
    exit /b 1
)

echo.
echo Step 2: Initializing project...
railway init

echo.
echo Step 3: Setting environment variables...

REM Generate secrets
for /f "delims=" %%i in ('powershell -Command "[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))"') do set POSTGRES_PASSWORD=%%i
for /f "delims=" %%i in ('powershell -Command "[Convert]::ToBase64String((1..64 | ForEach-Object {Get-Random -Maximum 256}))"') do set SECRET_KEY=%%i

railway variables set POSTGRES_PASSWORD=%POSTGRES_PASSWORD%
railway variables set SECRET_KEY=%SECRET_KEY%
railway variables set SIMULATION_MODE=true

echo.
echo Step 4: Deploying to Railway...
railway up

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Your app will be available at:
railway domain

echo.
echo View logs: railway logs
echo Open dashboard: railway open
echo.
pause

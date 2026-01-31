@echo off
echo ============================================
echo ResilienceGrid - Push Fixed Code to GitHub
echo ============================================
echo.

cd /d "C:\Users\Prathamesh\.gemini\antigravity\scratch\resilience-grid"

echo Checking remote status...
git remote -v

echo.
echo Current commit:
git log --oneline -1

echo.
echo ============================================
echo PUSH TO GITHUB
echo ============================================
echo.
echo If you haven't set up GitHub remote yet:
echo git remote add origin https://github.com/YOUR_USERNAME/resiliencegrid.git
echo.
echo To push the fixed Dockerfile:
echo.

git push

echo.
echo ============================================
echo After pushing:
echo - Go to Render dashboard
echo - Your app will auto-redeploy in ~5 minutes
echo - Check build logs for success
echo ============================================
echo.
pause

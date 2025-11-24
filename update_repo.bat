@echo off
echo ==========================================
echo   HOCI Platform - GitHub Update Script
echo ==========================================
echo.

set /p msg="Enter commit message (what did you change?): "

echo.
echo [1/3] Adding files...
git add .

echo.
echo [2/3] Committing changes...
git commit -m "%msg%"

echo.
echo [3/3] Pushing to GitHub...
git push origin main

echo.
echo ==========================================
echo   Update Complete! 🚀
echo ==========================================
pause

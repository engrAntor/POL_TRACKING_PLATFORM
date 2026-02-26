@echo off
:: ============================================
:: POL Tracking Platform - Start All Services
:: ============================================
:: Starts: Docker - Redis - Celery - Django - Next.js

echo ==========================================
echo   POL Tracking Platform - Starting...
echo ==========================================

:: 1. Start Docker Desktop (if not running)
echo.
echo [1/5] Checking Docker Desktop...
docker info >nul 2>&1
if errorlevel 1 (
    echo   Starting Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo   Waiting for Docker to initialize...
    :wait_docker
    timeout /t 3 /nobreak >nul
    docker info >nul 2>&1
    if errorlevel 1 goto wait_docker
)
echo   Docker is ready!

:: 2. Start Redis container
echo.
echo [2/5] Starting Redis...
docker start pol-redis >nul 2>&1 || docker run -d --name pol-redis -p 6379:6379 redis:latest
echo   Redis started on port 6379.

:: 3. Activate venv and start Celery worker
echo.
echo [3/5] Starting Celery worker...
cd /d "%~dp0backend"
start "Celery Worker" cmd /c "call venv\Scripts\activate.bat && celery -A config worker --loglevel=info --pool=solo"
timeout /t 3 /nobreak >nul
echo   Celery worker started.

:: 4. Start Django server
echo.
echo [4/5] Starting Django server...
start "Django Server" cmd /c "call venv\Scripts\activate.bat && python manage.py runserver 8000"
timeout /t 2 /nobreak >nul
echo   Django server started on http://127.0.0.1:8000

:: 5. Start Next.js frontend
echo.
echo [5/5] Starting Next.js frontend...
cd /d "%~dp0frontend"
start "Next.js Frontend" cmd /c "npm run dev"
timeout /t 3 /nobreak >nul
echo   Next.js frontend started on http://localhost:3000

echo.
echo ==========================================
echo   All services running!
echo   Frontend: http://localhost:3000
echo   Backend:  http://127.0.0.1:8000
echo   Redis:    127.0.0.1:6379
echo   Celery:   Worker active
echo ==========================================
echo.
echo Close this window or press any key to exit.
pause >nul

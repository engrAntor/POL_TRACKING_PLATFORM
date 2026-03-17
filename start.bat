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
echo [1/6] Checking Docker Desktop...
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
echo [2/6] Starting Redis...
docker start pol-redis >nul 2>&1 || docker run -d --name pol-redis -p 6379:6379 redis:latest
echo   Redis started on port 6379.

:: 3. Activate venv and start Celery worker
echo.
echo [3/6] Starting Celery worker...
cd /d "%~dp0backend"
start "Celery Worker" cmd /c "call venv\Scripts\activate.bat && celery -A config worker --loglevel=info --pool=solo"
timeout /t 3 /nobreak >nul
echo   Celery worker started.

:: 4. Start Django server
echo.
echo [4/6] Starting Django server...
start "Django Server" cmd /c "call venv\Scripts\activate.bat && python manage.py runserver 0.0.0.0:8000"
timeout /t 2 /nobreak >nul
echo   Django server started on http://127.0.0.1:8000

:: 5. Start AI Backend server
echo.
echo [5/6] Starting AI Backend server...
cd /d "%~dp0POL_AI-main"
if not exist venv (
    echo   Creating virtual environment for AI Backend...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo   Installing dependencies for AI Backend...
    pip install -r requirements.txt >nul 2>&1
) else (
    call venv\Scripts\activate.bat
)
start "AI Backend" cmd /c "call venv\Scripts\activate.bat && python manage.py runserver 8001"
timeout /t 2 /nobreak >nul
echo   AI Backend server started on http://127.0.0.1:8001

:: 6. Start Next.js frontend
echo.
echo [6/6] Starting Next.js frontend...
cd /d "%~dp0frontend"
start "Next.js Frontend" cmd /c "npm run dev"
timeout /t 3 /nobreak >nul
echo   Next.js frontend started on http://localhost:3000

echo.
echo ==========================================
echo   All services running!
echo   Frontend: http://localhost:3000
echo   Backend:  http://127.0.0.1:8000
echo   AI API:   http://127.0.0.1:8001
echo   Redis:    127.0.0.1:6379
echo   Celery:   Worker active
echo ==========================================
echo.
echo Close this window or press any key to exit.
pause >nul

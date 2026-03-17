@echo off
:: ============================================
:: POL Tracking Platform - Start All Services
:: ============================================
:: Starts the Dockerized application via docker-compose

echo ==========================================
echo   POL Tracking Platform - Starting...
echo ==========================================

:: 1. Start Docker Desktop (if not running)
echo.
echo [1/2] Checking Docker Desktop...
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

:: 2. Start Application via Docker Compose
echo.
echo [2/2] Starting Docker Containers...
cd /d "%~dp0"
docker compose up --build -d

echo.
echo ==========================================
echo   All services running inside Docker!
echo   Frontend: http://localhost:3000
echo   Backend:  http://127.0.0.1:8000
echo   AI API:   http://127.0.0.1:8001
echo ==========================================
echo.
echo Close this window or press any key to exit.
pause >nul

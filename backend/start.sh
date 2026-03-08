#!/bin/bash
# ============================================
# POL Tracking Backend - Start All Services
# ============================================
# Starts: Docker Redis → Celery Worker → Django Server

cd "$(dirname "$0")"

echo "=========================================="
echo "  POL Tracking Backend - Starting..."
echo "=========================================="

# 1. Start Docker Desktop (if not running)
echo ""
echo "[1/4] Checking Docker Desktop..."
if ! docker info > /dev/null 2>&1; then
    echo "  Starting Docker Desktop..."
    cmd.exe /c "start /B \"Docker\" \"C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe\"" 2>/dev/null
    echo "  Waiting for Docker to initialize..."
    for i in {1..30}; do
        if docker info > /dev/null 2>&1; then
            echo "  Docker is ready!"
            break
        fi
        sleep 2
    done
    if ! docker info > /dev/null 2>&1; then
        echo "  ERROR: Docker failed to start. Please start Docker Desktop manually."
        exit 1
    fi
else
    echo "  Docker is already running."
fi

# 2. Start Redis container
echo ""
echo "[2/4] Starting Redis..."
if docker ps --format '{{.Names}}' | grep -q '^pol-redis$'; then
    echo "  Redis is already running."
else
    docker start pol-redis 2>/dev/null || docker run -d --name pol-redis -p 6379:6379 redis:latest
    echo "  Redis started on port 6379."
fi

# 3. Activate venv & start Celery worker in background
echo ""
echo "[3/4] Starting Celery worker..."
source venv/Scripts/activate
celery -A config worker --loglevel=info --pool=solo &
CELERY_PID=$!
sleep 3
echo "  Celery worker started (PID: $CELERY_PID)."

# 4. Start Django server
echo ""
echo "[4/4] Starting Django server..."
echo "=========================================="
echo "  All services running!"
echo "  Django:  http://127.0.0.1:8000"
echo "  Redis:   127.0.0.1:6379"
echo "  Celery:  Worker active"
echo "=========================================="
echo ""
python manage.py runserver 8000

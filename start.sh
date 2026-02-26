#!/bin/bash
# ============================================
# POL Tracking Platform - Start All Services
# ============================================
# Starts: Docker → Redis → Celery → Django → Next.js

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "=========================================="
echo "  POL Tracking Platform - Starting..."
echo "=========================================="

# 1. Start Docker Desktop (if not running)
echo ""
echo "[1/5] Checking Docker Desktop..."
if ! docker info > /dev/null 2>&1; then
    echo "  Starting Docker Desktop..."
    "/c/Program Files/Docker/Docker/Docker Desktop.exe" &
    echo "  Waiting for Docker to initialize..."
    for i in {1..40}; do
        if docker info > /dev/null 2>&1; then
            echo "  Docker is ready!"
            break
        fi
        sleep 3
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
echo "[2/5] Starting Redis..."
if docker ps --format '{{.Names}}' | grep -q '^pol-redis$'; then
    echo "  Redis is already running."
else
    docker start pol-redis 2>/dev/null || docker run -d --name pol-redis -p 6379:6379 redis:latest
    echo "  Redis started on port 6379."
fi

# 3. Activate venv & start Celery worker in background
echo ""
echo "[3/5] Starting Celery worker..."
cd "$BACKEND_DIR"
source venv/Scripts/activate
celery -A config worker --loglevel=info --pool=solo > /dev/null 2>&1 &
CELERY_PID=$!
sleep 3
echo "  Celery worker started (PID: $CELERY_PID)."

# 4. Start Django server in background
echo ""
echo "[4/5] Starting Django server..."
python manage.py runserver 8000 > /dev/null 2>&1 &
DJANGO_PID=$!
sleep 2
echo "  Django server started (PID: $DJANGO_PID)."

# 5. Start Next.js frontend
echo ""
echo "[5/5] Starting Next.js frontend..."
cd "$FRONTEND_DIR"
npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!
sleep 3
echo "  Next.js frontend started (PID: $FRONTEND_PID)."

echo ""
echo "=========================================="
echo "  All services running!"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://127.0.0.1:8000"
echo "  Redis:    127.0.0.1:6379"
echo "  Celery:   Worker active"
echo "=========================================="
echo ""
echo "Press Ctrl+C to stop all services."

# Wait and cleanup on exit
trap "echo ''; echo 'Stopping all services...'; kill $CELERY_PID $DJANGO_PID $FRONTEND_PID 2>/dev/null; echo 'Done.'; exit 0" SIGINT SIGTERM
wait

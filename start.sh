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
echo "[1/6] Checking Docker Desktop..."
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
echo "[2/6] Starting Redis..."
if docker ps --format '{{.Names}}' | grep -q '^pol-redis$'; then
    echo "  Redis is already running."
else
    docker start pol-redis 2>/dev/null || docker run -d --name pol-redis -p 6379:6379 redis:latest
    echo "  Redis started on port 6379."
fi

# 3. Activate venv & start Celery worker in background
echo ""
echo "[3/6] Starting Celery worker..."
cd "$BACKEND_DIR"
source venv/Scripts/activate
celery -A config worker --loglevel=info --pool=solo > /dev/null 2>&1 &
CELERY_PID=$!
sleep 3
echo "  Celery worker started (PID: $CELERY_PID)."

# 4. Start Django server in background
echo ""
echo "[4/6] Starting Django server..."
python manage.py runserver 0.0.0.0:8000 > /dev/null 2>&1 &
DJANGO_PID=$!
sleep 2
echo "  Django server started (PID: $DJANGO_PID)."

# 5. Start AI Backend server in background
echo ""
echo "[5/6] Starting AI Backend server..."
cd "$ROOT_DIR/POL_AI-main"
if [ ! -d "venv" ]; then
    echo "  Creating virtual environment for AI Backend..."
    python -m venv venv
    source venv/Scripts/activate
    echo "  Installing dependencies for AI Backend..."
    pip install -r requirements.txt > /dev/null 2>&1
else
    source venv/Scripts/activate
fi
python manage.py runserver 8001 > /dev/null 2>&1 &
AI_PID=$!
sleep 2
echo "  AI Backend server started (PID: $AI_PID)."

# 6. Start Next.js frontend
echo ""
echo "[6/6] Starting Next.js frontend..."
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
echo "  AI API:   http://127.0.0.1:8001"
echo "  Redis:    127.0.0.1:6379"
echo "  Celery:   Worker active"
echo "=========================================="
echo ""
echo "Press Ctrl+C to stop all services."

# Wait and cleanup on exit
trap "echo ''; echo 'Stopping all services...'; kill $CELERY_PID $DJANGO_PID $AI_PID $FRONTEND_PID 2>/dev/null; echo 'Done.'; exit 0" SIGINT SIGTERM
wait

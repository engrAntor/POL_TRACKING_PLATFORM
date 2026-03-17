#!/bin/bash
# ============================================
# POL Tracking Platform - Start All Services
# ============================================
# Starts the Dockerized application via docker-compose

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=========================================="
echo "  POL Tracking Platform - Starting..."
echo "=========================================="

# 1. Start Docker Desktop (if not running)
echo ""
echo "[1/2] Checking Docker Desktop..."
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

# 2. Start Application via Docker Compose
echo ""
echo "[2/2] Starting Docker Containers..."
cd "$ROOT_DIR"
docker compose up --build -d

echo ""
echo "=========================================="
echo "  All services running inside Docker!"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://127.0.0.1:8000"
echo "  AI API:   http://127.0.0.1:8001"
echo "=========================================="
echo ""
echo "Use 'docker compose logs -f' to view logs."
echo "Use 'docker compose down' to stop the services."

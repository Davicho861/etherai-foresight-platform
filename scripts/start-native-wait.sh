#!/usr/bin/env bash
# Wait for backend to be available and then start frontend (vite)
set -euo pipefail

BACKEND_PORT=${BACKEND_PORT:-4000}
VITE_PORT=${VITE_PORT:-3002}
WAIT_URL="http://localhost:${BACKEND_PORT}/healthz"
TIMEOUT=${TIMEOUT:-60}

echo "[start-native-wait] Waiting for backend at ${WAIT_URL} (timeout ${TIMEOUT}s)"

SECONDS=0
while ! curl -sSf ${WAIT_URL} >/dev/null 2>&1; do
  if [ ${SECONDS} -ge ${TIMEOUT} ]; then
    echo "[start-native-wait] Timeout waiting for backend after ${TIMEOUT}s"
    exit 1
  fi
  sleep 1
done

echo "[start-native-wait] Backend is up. Starting Vite on port ${VITE_PORT}..."
# export port so vite picks it up
export VITE_PORT
exec npx vite --port ${VITE_PORT}

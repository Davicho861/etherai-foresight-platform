#!/usr/bin/env bash
set -euo pipefail

echo "Waiting for services to be healthy..."

# Services to wait for
SERVICES=("db" "backend" "frontend")

# Maximum wait time in seconds
MAX_WAIT=300
WAIT_INTERVAL=5

elapsed=0
while [ $elapsed -lt $MAX_WAIT ]; do
  all_healthy=true

  for service in "${SERVICES[@]}"; do
    if ! docker-compose ps $service | grep -q "Up (healthy)"; then
      all_healthy=false
      break
    fi
  done

  if $all_healthy; then
    echo "All services are healthy!"
    exit 0
  fi

  echo "Waiting for services... ($elapsed/$MAX_WAIT seconds)"
  sleep $WAIT_INTERVAL
  elapsed=$((elapsed + WAIT_INTERVAL))
done

echo "Timeout waiting for services to be healthy"
docker-compose ps
exit 1
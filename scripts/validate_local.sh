#!/usr/bin/env bash
set -euo pipefail

# Lightweight local validator:
# - Builds and starts docker-compose
# - Waits for services using existing wait-for-services.sh
# - Runs Playwright tests (requires Playwright installed in workspace)

echo "Starting local validation: building containers and running E2E tests..."

# Export host UID/GID so docker-compose can pass them to containers (prevents root-owned artifacts)
export HOST_UID=$(id -u)
export HOST_GID=$(id -g)

# By default we use the dockerized ollama-mock service. If you explicitly want
# to run a host-level mock (for local debugging), set USE_HOST_OLLAMA=1 in the
# environment before running this script.
MOCK_PID=""
if [ "${USE_HOST_OLLAMA:-0}" = "1" ]; then
  # Only start a host mock if requested. If something is already listening, reuse it.
  if ss -ltnp | grep -q ":11434"; then
    echo "Port 11434 already in use — assuming an Ollama service is available"
    MOCK_PID=""
  else
    echo "Starting mock Ollama on http://localhost:11434"
    node ./scripts/mock_ollama.js &
    MOCK_PID=$!

    # wait for mock to be ready
    for i in {1..20}; do
      if curl -sS http://localhost:11434/ >/dev/null 2>&1; then
        echo "Mock Ollama is ready"
        break
      fi
      sleep 0.5
    done
    if ! curl -sS http://localhost:11434/ >/dev/null 2>&1; then
      echo "Mock Ollama did not start in time" >&2
      if [ -n "${MOCK_PID:-}" ]; then
        kill $MOCK_PID || true
      fi
      exit 1
    fi
  fi
else
  echo "Using dockerized ollama-mock (not starting host mock). Set USE_HOST_OLLAMA=1 to override."
fi

docker-compose up -d --build

# reuse wait script
./scripts/wait-for-services.sh

# Ensure test-results folder is writable to avoid permission issues from previous runs
mkdir -p test-results
chmod -R a+rw test-results || true

# Run Playwright tests (install deps in advance). Set SKIP_BUILD=1 to skip Docker build during iterative runs.
if ! command -v npx >/dev/null 2>&1; then
  echo "npx not found. Please install Node.js and ensure npx is available." >&2
  exit 1
fi

if [ "${SKIP_BUILD:-0}" = "1" ]; then
  echo "SKIP_BUILD=1 set, skipping Docker build/wait steps and running Playwright only"
fi

echo "Running Playwright E2E tests from the host (or in an ephemeral container)..."

echo "Running Playwright E2E tests inside containerized runner to avoid host permissions issues..."

# Use the docker-compose service `e2e-tester` as the canonical isolated runner.
# This service installs Playwright and runs the tests inside the container.
if docker-compose run --rm e2e-tester; then
  EXIT_CODE=$?
  if [ $EXIT_CODE -ne 0 ]; then
    echo "Playwright tests (container) failed with exit code $EXIT_CODE" >&2
    exit $EXIT_CODE
  fi
else
  # If the e2e-tester service is not defined, run Playwright inside an
  # ephemeral official Playwright container attached to the same docker
  # network used by docker-compose so service hostnames (e.g. `backend`)
  # resolve correctly. This avoids host/network DNS problems.
  echo "e2e-tester service missing — running Playwright in an ephemeral Playwright container"
  # Ensure the compose network name is available; default declared in docker-compose.yml
  NETWORK_NAME=${COMPOSE_PROJECT_NAME:-$(basename "$PWD")}_praevisio_network
  # Fallback to explicit network name used in compose file
  NETWORK_NAME="praevisio_network"
  docker run --rm \
    --network "$NETWORK_NAME" \
    -v "$PWD":/app \
    -w /app \
    -e FRONTEND_URL=http://frontend:3002 \
    -e API_BASE=http://backend:4000 \
    -e PRAEVISIO_BEARER_TOKEN=${PRAEVISIO_BEARER_TOKEN:-demo-token} \
    mcr.microsoft.com/playwright:v1.55.1-jammy \
    bash -lc "npm ci --include=dev --no-audit --no-fund || npm install --legacy-peer-deps --no-audit --no-fund; npx playwright test" || (echo "Playwright tests (container) failed" >&2; exit 1)
fi

echo "Local validation completed."
cleanup() {
  if [ -n "${MOCK_PID:-}" ]; then
    echo "Stopping mock Ollama ($MOCK_PID)"
    kill $MOCK_PID || true
  fi
}

trap cleanup EXIT

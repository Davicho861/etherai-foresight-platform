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

# Prefer running Playwright from host using npx if available. This keeps the
# live docker-compose stack focused on runtime services without embedding the
# test runner as a long-lived service.
if command -v npx >/dev/null 2>&1; then
  echo "Running: npx playwright test"
  # Ensure Playwright browsers are installed; this is idempotent.
  npx playwright install --with-deps
  # Run Playwright using the workspace config. We forward any PLAYWRIGHT_* env
  # variables already set by the user.
  npx playwright test --config=playwright.config.ts --reporter=list
  EXIT_CODE=$?
  if [ $EXIT_CODE -ne 0 ]; then
    echo "Playwright tests failed with exit code $EXIT_CODE" >&2
    exit $EXIT_CODE
  fi
else
  echo "npx not found. Falling back to running Playwright inside an ephemeral container."
  # Run Playwright inside a temporary container that mounts the workspace.
  docker run --rm -it \
    -v "$PWD":/app:cached \
    -w /app \
    node:20-bullseye-slim \
    sh -c "npm ci --no-audit --no-fund --prefer-offline || true && npx playwright install --with-deps && npx playwright test --config=playwright.config.ts --reporter=list"
  EXIT_CODE=$?
  if [ $EXIT_CODE -ne 0 ]; then
    echo "Playwright tests (container) failed with exit code $EXIT_CODE" >&2
    exit $EXIT_CODE
  fi
fi

echo "Local validation completed."
cleanup() {
  if [ -n "${MOCK_PID:-}" ]; then
    echo "Stopping mock Ollama ($MOCK_PID)"
    kill $MOCK_PID || true
  fi
}

trap cleanup EXIT

#!/usr/bin/env bash
set -euo pipefail

# Lightweight local validator:
# - Builds and starts docker-compose
# - Waits for services using existing wait-for-services.sh
# - Runs Playwright tests (requires Playwright installed in workspace)

echo "Starting local validation: building containers and running E2E tests..."

# Start a lightweight mock Ollama API so the backend has a local LLM endpoint during tests
# Only start the mock if the port is free. If something is already listening (local or docker), reuse it.
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

echo "Waiting for e2e-tester container to finish and collecting results..."

# Wait up to TIMEOUT seconds for the e2e-tester container to finish
TIMEOUT=${E2E_TIMEOUT:-600}
elapsed=0
while /bin/true; do
  running=$(docker inspect -f '{{.State.Running}}' praevisio_e2e_tester 2>/dev/null || echo "false")
  if [ "$running" != "true" ]; then
    break
  fi
  sleep 1
  elapsed=$((elapsed+1))
  if [ "$elapsed" -ge "$TIMEOUT" ]; then
    echo "Timeout waiting for e2e-tester to finish" >&2
    docker logs praevisio_e2e_tester --tail 200 || true
    exit 1
  fi
done

EXIT_CODE=$(docker inspect -f '{{.State.ExitCode}}' praevisio_e2e_tester 2>/dev/null || echo 1)
echo "--- e2e-tester logs (tail 400) ---"
docker logs praevisio_e2e_tester --tail 400 || true

if [ "$EXIT_CODE" -ne 0 ]; then
  echo "E2E tests failed with exit code $EXIT_CODE" >&2
  exit $EXIT_CODE
fi

echo "Local validation completed."
cleanup() {
  if [ -n "${MOCK_PID:-}" ]; then
    echo "Stopping mock Ollama ($MOCK_PID)"
    kill $MOCK_PID || true
  fi
}

trap cleanup EXIT

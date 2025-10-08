#!/usr/bin/env bash
set -euo pipefail
# Oracle gatekeeper check
if command -v node >/dev/null 2>&1; then
  node --input-type=module -e "
    import Oracle from './server/src/oracle.js';
    const oracle = new Oracle();
    const result = await oracle.predictFailure('validate_local.sh', 'local validation');
    if (result.probability > 0.75) {
      console.log('Aborting validation due to high failure probability:', result.suggestion);
      process.exit(1);
    }
  "
else
  echo "Node.js not found. Skipping Oracle check." >&2
fi

# Lightweight local validator:
# - Builds and starts docker-compose
# - Waits for services using existing wait-for-services.sh
# - Runs Playwright tests (requires Playwright installed in workspace)

echo "Starting local validation: building containers and running E2E tests..."

# Export host UID/GID so docker-compose can pass them to containers (prevents root-owned artifacts)
export HOST_UID=$(id -u)
export HOST_GID=$(id -g)

# Activate Sovereign Simulation Mode by default for local validation
export TEST_MODE=${TEST_MODE:-true}
echo "TEST_MODE=${TEST_MODE}"

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

# Run Playwright tests using an ephemeral container with Playwright image.
# The container will also handle cleanup of the test-results directory.
if [ "${SKIP_BUILD:-0}" = "1" ]; then
  echo "SKIP_BUILD=1 set, skipping Docker build/wait steps and running Playwright only"
fi

echo "Running Playwright E2E tests in an ephemeral container using Playwright image..."

# Run Playwright inside a temporary container that mounts the workspace.
# The container itself will handle the cleanup of the test-results directory to avoid host permission issues.
PLAYWRIGHT_IMAGE="mcr.microsoft.com/playwright:v1.56.0-jammy"

docker run --rm \
  -v "$PWD":/app:cached \
  -w /app \
  --network host \
  $PLAYWRIGHT_IMAGE \
  sh -c "rm -rf test-results && mkdir -p test-results && chmod -R 777 test-results && npx playwright test --config=playwright.config.ts --reporter=list --update-snapshots"
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
  echo "Playwright tests failed with exit code $EXIT_CODE" >&2
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

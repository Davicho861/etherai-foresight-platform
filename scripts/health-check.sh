#!/usr/bin/env bash
# Smoke test / health check for native dev stack
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_URL=${BACKEND_URL:-http://localhost:4000}
FRONTEND_URL=${FRONTEND_URL:-http://localhost:3002}

echo "Health check for Praevisio native dev"

echo "- Checking backend platform-status..."
if curl -sS -m 5 "$BACKEND_URL/api/platform-status" | jq . >/dev/null 2>&1; then
  echo "  OK: platform-status reachable"
else
  echo "  FAIL: platform-status not reachable"
fi

echo "- Checking backend global-risk..."
if curl -sS -m 10 "$BACKEND_URL/api/global-risk" | jq . >/dev/null 2>&1; then
  echo "  OK: global-risk endpoint reachable"
else
  echo "  WARN: global-risk not reachable or returned non-json"
fi

echo "- Checking frontend root..."
if curl -sS -m 5 "$FRONTEND_URL" | grep -i "<!doctype html>" >/dev/null 2>&1; then
  echo "  OK: frontend serving HTML"
else
  echo "  FAIL: frontend not serving HTML"
fi

# Check mocks
for port in 4010 4020 4030; do
  if ss -ltnp 2>/dev/null | grep -q ":${port}\b"; then
    echo "  OK: mock on port ${port} listening"
  else
    echo "  WARN: mock on port ${port} not listening"
  fi
done

exit 0

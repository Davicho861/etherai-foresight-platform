#!/usr/bin/env bash
# Wrapper usado por systemd: arranca mocks y luego la app en background
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Export native mode
export NATIVE_DEV_MODE=true
export PORT=${PORT:-4001}
export VITE_PORT=${VITE_PORT:-3002}

# Start mocks (will noop if already running)
if ss -ltnp 2>/dev/null | grep -q ':4010\|:4020\|:4030'; then
  echo "Some mocks already listening"
else
  echo "Starting local mocks"
  "$ROOT_DIR/scripts/start-mocks.sh" || true
fi

# Start app in background
echo "Starting app in background"
/usr/bin/env bash -lc 'cd "$ROOT_DIR" && npm run start:background' || true

exit 0

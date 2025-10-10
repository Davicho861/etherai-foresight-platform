#!/usr/bin/env bash
# Stop Praevisio AI native background processes started by start-native.sh
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT_DIR/logs"

# Kill vite
pkill -f vite || true
# Kill node server process
pkill -f "node src/index.js" || true

# Optionally remove logs? keep them
echo "Stopped Praevisio AI background processes. Logs remain in $LOG_DIR"
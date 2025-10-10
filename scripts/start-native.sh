#!/usr/bin/env bash
# Start Praevisio AI in native background mode on Linux (Debian 12)
# - Exports NATIVE_DEV_MODE=true
# - Starts server (nodemon) and frontend (vite) in background with logs
# - Uses nohup so processes keep running after terminal closes

set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR"
export NATIVE_DEV_MODE=true

# Allow overriding ports via environment
export PORT=${PORT:-4001}
export VITE_PORT=${VITE_PORT:-3002}

echo "Starting Praevisio AI in native background mode (requested PORT=$PORT, requested VITE_PORT=$VITE_PORT)"

# Helper: kill processes owned by current user matching a pattern
kill_user_procs() {
  local pattern="$1"
  pids=$(ps -u "$(id -u -n)" -o pid,cmd | egrep "$pattern" | awk '{print $1}' || true)
  if [ -n "$pids" ]; then
    echo "Killing user processes for pattern: $pattern -> $pids"
    kill $pids || true
  fi
}

# Ensure a port is free or pick an alternate. If occupied by current user, kill it.
ensure_port_free() {
  local varname="$1"
  local desired_port="$2"
  local max_tries=10
  local me=$(id -un)
  for ((i=0;i<max_tries;i++)); do
    candidate=$((desired_port + i))
    entry=$(ss -ltnp 2>/dev/null | grep -E ":${candidate}\\b" || true)
    if [ -z "$entry" ]; then
      eval "$varname=$candidate"
      return 0
    fi
    pid=$(echo "$entry" | sed -n 's/.*pid=\([0-9]\+\).*/\1/p' || true)
    if [ -z "$pid" ]; then
      echo "Could not parse PID for port $candidate, skipping..."
      continue
    fi
    owner=$(ps -o user= -p "$pid" 2>/dev/null || true)
    if [ "$owner" = "$me" ]; then
      echo "Killing user-owned process $pid on port $candidate"
      kill "$pid" || true
      sleep 1
      still=$(ss -ltnp 2>/dev/null | grep -E ":${candidate}\\b" || true)
      if [ -z "$still" ]; then
        eval "$varname=$candidate"
        return 0
      else
        echo "Port $candidate still occupied after kill, continuing..."
      fi
    else
      echo "Port $candidate in use by other user ($owner), trying next port..."
      continue
    fi
  done
  echo "No free port found in range ${desired_port}..$((desired_port+max_tries-1)), using $desired_port (may fail)"
  eval "$varname=$desired_port"
  return 1
}

# Ensure server and vite ports are free or adjusted
ensure_port_free PORT "$PORT"
ensure_port_free VITE_PORT "$VITE_PORT"

# Stop any previous user-owned server/vite processes (pattern-based cleanup)
kill_user_procs "node src/index.js"
kill_user_procs "vite"

# Start server (nodemon) in background under current user
cd "$ROOT_DIR/server"
echo "Starting server... (logs -> $LOG_DIR/server.log) on PORT=$PORT"
PORT=$PORT nohup npm run dev > "$LOG_DIR/server.log" 2>&1 &
sleep 1

# Start frontend (vite) in background under current user
cd "$ROOT_DIR"
echo "Starting frontend... (logs -> $LOG_DIR/frontend.log) on VITE_PORT=$VITE_PORT"
VITE_PORT=$VITE_PORT nohup npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
sleep 1

echo "Started Praevisio AI in native background mode. Logs: $LOG_DIR"

# Show the last lines of logs to help debugging
echo "--- server log (tail 80) ---"
tail -n 80 "$LOG_DIR/server.log" || true
echo "--- frontend log (tail 80) ---"
tail -n 80 "$LOG_DIR/frontend.log" || true
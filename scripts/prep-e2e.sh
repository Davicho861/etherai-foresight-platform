#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ME=$(id -un)

# Ports to ensure free for E2E
PORTS=(4000 3002)

echo "Preparing environment for E2E. Ensuring ports free: ${PORTS[*]}"

for p in "${PORTS[@]}"; do
  entry=$(ss -ltnp 2>/dev/null | grep -E ":${p}\\b" || true)
  if [ -n "$entry" ]; then
    pid=$(echo "$entry" | sed -n 's/.*pid=\([0-9]\+\).*/\1/p' || true)
    owner=$(ps -o user= -p "$pid" 2>/dev/null || true)
    if [ "$owner" = "$ME" ] && [ -n "$pid" ]; then
      echo "Killing local process $pid using port $p"
      kill "$pid" || true
      sleep 1
    else
      echo "Port $p is in use by $owner (pid $pid). Please free it or run E2E in an isolated environment." >&2
      exit 1
    fi
  else
    echo "Port $p is free"
  fi
done

echo "Environment prepared." 

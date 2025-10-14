#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DRY_RUN=0
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=1
fi

run() {
  echo "+ $*"
  if [[ $DRY_RUN -eq 0 ]]; then
    eval "$@"
  fi
}

echo "Praevisio Atlas Bootstrap"
if [[ $DRY_RUN -eq 1 ]]; then
  echo "DRY RUN MODE - no changes will be made"
fi

run "docker-compose up -d db neo4j"
run "npm ci"
run "cd \"$ROOT_DIR/server\" && npm ci && npx prisma generate --schema=./prisma/schema.prisma"
run "cd \"$ROOT_DIR/server\" && set -o allexport; source \"$ROOT_DIR/server/.env\"; set +o allexport; npx prisma migrate dev --name init --schema=./prisma/schema.prisma || true"
run "cd \"$ROOT_DIR/server\" && set -o allexport; source \"$ROOT_DIR/server/.env\"; set +o allexport; npm run seed || true"

# Start backend and frontend in background (native)
run "set -o allexport; source \"$ROOT_DIR/server/.env\"; set +o allexport; export PORT=4003 VITE_PORT=3002; npx kill-port 4000 4001 4003 3000 3002 3003 || true"
run "nohup bash -lc 'set -o allexport; source \"$ROOT_DIR/server/.env\"; set +o allexport; npm run start:native' > start_native.log 2>&1 & echo started"

# Run puppeteer captures
run "node \"$ROOT_DIR/scripts/puppeteer_capture.js\""

echo "Bootstrap completed (dry-run=$DRY_RUN)"

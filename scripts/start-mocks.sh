#!/usr/bin/env bash
# Start all local API mocks for native development
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR"

echo "Starting World Bank mock..."
WPORT=${WORLDBANK_MOCK_PORT:-4010}
nohup node "$ROOT_DIR/server/mocks/worldbank-mock.js" > "$LOG_DIR/mock-worldbank.log" 2>&1 &
WB_PID=$!

echo "Starting GDELT mock..."
GPORT=${GDELT_MOCK_PORT:-4020}
nohup node "$ROOT_DIR/server/mocks/gdelt-mock.js" > "$LOG_DIR/mock-gdelt.log" 2>&1 &
G_PID=$!

echo "Starting Open-Meteo mock..."
OPORT=${OPEN_METEO_MOCK_PORT:-4030}
nohup node "$ROOT_DIR/server/mocks/open-meteo-mock.js" > "$LOG_DIR/mock-openmeteo.log" 2>&1 &
O_PID=$!

sleep 1

echo "Mocks started: WB=$WB_PID (port $WPORT), GDELT=$G_PID (port $GPORT), OPENMETEO=$O_PID (port $OPORT)"

echo "--- mock logs (tail 50) ---"
tail -n 50 "$LOG_DIR/mock-worldbank.log" || true
tail -n 50 "$LOG_DIR/mock-gdelt.log" || true
tail -n 50 "$LOG_DIR/mock-openmeteo.log" || true

exit 0

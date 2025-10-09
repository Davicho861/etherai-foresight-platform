#!/usr/bin/env bash
set -euo pipefail

# Despliega el backend en Railway usando la CLI de railway.
# Requiere que RAILWAY_TOKEN esté exportado en el entorno.

if [ -z "${RAILWAY_TOKEN:-}" ]; then
  echo "RAILWAY_TOKEN no proporcionado. Saltando despliegue backend para evitar fallos en CI." >&2
  exit 0
fi

if ! command -v railway >/dev/null 2>&1; then
  echo "CLI 'railway' no encontrada. Intentando instalar localmente (silencioso)..."
  curl -sSfL https://cli.railway.app/install.sh | sh || true
fi

echo "Desplegando backend en Railway (modo CI, no interactivo)..."

# Login with token (best-effort)
echo "$RAILWAY_TOKEN" | railway login --apiKey - >/dev/null 2>&1 || true

# Trigger deployment (detached) and prefer non-interactive
if railway up --detach --yes >/dev/null 2>&1; then
  echo "railway up triggered"
else
  echo "railway up returned non-zero; collecting status for debug" >&2
  railway status --json > railway-status.json || true
fi

# Try to extract public URL for convenience; non-fatal
if [ -f railway-status.json ]; then
  if command -v jq >/dev/null 2>&1; then
    RAILWAY_URL=$(jq -r '.services[].urls[0] // .services[].url // empty' railway-status.json | head -n1 || true)
    if [ -n "$RAILWAY_URL" ]; then
      echo "RAILWAY_BACKEND_URL=$RAILWAY_URL"
      echo "RAILWAY_BACKEND_URL=$RAILWAY_URL" > .railway_backend_url
    fi
  fi
fi

echo "Backend deploy script finished (best-effort)."
exit 0

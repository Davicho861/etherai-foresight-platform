#!/usr/bin/env bash
set -euo pipefail

# Despliega el backend en Railway usando la CLI de railway.
# Requiere que RAILWAY_TOKEN esté exportado en el entorno.

if [ -z "${RAILWAY_TOKEN:-}" ]; then
  echo "RAILWAY_TOKEN o RAILWAY_API_KEY no configurado. Exporta la variable antes de ejecutar." >&2
  exit 1
fi

if ! command -v railway >/dev/null 2>&1; then
  echo "CLI 'railway' no encontrada. Instalando localmente..."
  curl -sSfL https://cli.railway.app/install.sh | sh
fi

echo "Desplegando backend en Railway (modo CI, no interactivo)..."

# Login con token
if [ -n "${RAILWAY_TOKEN:-}" ]; then
  echo "$RAILWAY_TOKEN" | railway login --apiKey - || true
else
  echo "$RAILWAY_API_KEY" | railway login --apiKey - || true
fi

# Intentar desplegar (ci-friendly)
railway up --yes || true

# Exportar estado a JSON y tratar de extraer una URL pública
if railway status --json > railway-status.json 2>/dev/null; then
  RAILWAY_URL=$(jq -r '.services[].urls[0] // .services[].url // empty' railway-status.json | head -n1 || true)
  if [ -n "$RAILWAY_URL" ]; then
    echo "RAILWAY_BACKEND_URL=$RAILWAY_URL"
    # Emitir una línea clave para consumirse en CI
    echo "RAILWAY_BACKEND_URL=$RAILWAY_URL" > .railway_backend_url
    exit 0
  fi
fi

echo "No se pudo extraer URL desde Railway. Puedes proporcionar RAILWAY_BACKEND_URL manualmente." >&2
exit 0

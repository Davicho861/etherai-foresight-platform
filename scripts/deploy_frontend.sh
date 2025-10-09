#!/usr/bin/env bash
set -euo pipefail

# Despliega el frontend en Vercel en modo CI.
# Requiere: VERCEL_TOKEN en el entorno. RAILWAY_BACKEND_URL opcionalmente.

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "VERCEL_TOKEN no está configurado. Exporta VERCEL_TOKEN antes de ejecutar." >&2
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "CLI 'vercel' no encontrada. Instalando..."
  npm install -g vercel@latest
fi

BACKEND_URL="${RAILWAY_BACKEND_URL:-}"
if [ -z "$BACKEND_URL" ]; then
  echo "RAILWAY_BACKEND_URL no provisto. Continuando sin definir variable en build." >&2
fi

echo "Desplegando frontend en Vercel (modo CI, no interactivo)..."

# Pasar variables de entorno al build/deploy usando -e
if [ -n "$BACKEND_URL" ]; then
  vercel --prod --token "$VERCEL_TOKEN" -e RAILWAY_BACKEND_URL="$BACKEND_URL"
else
  vercel --prod --token "$VERCEL_TOKEN"
fi

echo "Despliegue frontend iniciado. Revisa Vercel dashboard para la URL pública."

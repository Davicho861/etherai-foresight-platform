#!/usr/bin/env bash
set -euo pipefail

# Despliega el frontend en Vercel usando la CLI de vercel.
# Requiere VERCEL_TOKEN en el entorno.

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "VERCEL_TOKEN no está configurado. Exporta VERCEL_TOKEN antes de ejecutar." >&2
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "CLI 'vercel' no encontrada. Instálala: https://vercel.com/docs/cli" >&2
  exit 1
fi

BACKEND_URL="${RAILWAY_BACKEND_URL:-}"
if [ -z "$BACKEND_URL" ]; then
  echo "RAILWAY_BACKEND_URL no provisto. Establece la variable o exporta RAILWAY_BACKEND_URL." >&2
  exit 1
fi

echo "Actualizando vercel.json para apuntar a $BACKEND_URL"

TMPFILE=$(mktemp)
jq --arg url "$BACKEND_URL" '.rewrites[0].destination = "https://" + $url + "/api/$1"' vercel.json > "$TMPFILE"
mv "$TMPFILE" vercel.json

echo "Haciendo deploy en Vercel (se usará el token del entorno)..."
vercel --prod --token "$VERCEL_TOKEN"

echo "Despliegue iniciado. Revisa Vercel dashboard para la URL pública." 

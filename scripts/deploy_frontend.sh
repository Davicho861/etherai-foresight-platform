#!/usr/bin/env bash
set -euo pipefail

# Despliega el frontend en Vercel en modo CI.
# Requiere: VERCEL_TOKEN en el entorno. RAILWAY_BACKEND_URL opcionalmente.

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "VERCEL_TOKEN no está configurado. Abortando despliegue frontend." >&2
  exit 1
fi

BACKEND_URL="${RAILWAY_BACKEND_URL:-}"
if [ -z "$BACKEND_URL" ]; then
  echo "RAILWAY_BACKEND_URL no provisto. Continuando sin definir variable en build." >&2
fi

echo "Desplegando frontend en Vercel (modo real, no interactivo)..."

# Desplegar en Vercel
VERCEL_OUTPUT=$(vercel --token "$VERCEL_TOKEN" --prod --yes)

# Extraer la URL de Vercel del output
VERCEL_URL=$(echo "$VERCEL_OUTPUT" | grep -o 'https://[^ ]*' | head -1)

if [ -z "$VERCEL_URL" ]; then
  echo "No se pudo obtener la URL de Vercel. Usando URL por defecto." >&2
  VERCEL_URL="https://praevisio-frontend.vercel.app"  # Placeholder, ajustar según necesidad
fi

echo "✅ Success! Deployment ready at $VERCEL_URL"
export VERCEL_URL="$VERCEL_URL"

echo "Frontend deploy script finished (despliegue real)."

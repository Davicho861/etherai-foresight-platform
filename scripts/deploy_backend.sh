#!/usr/bin/env bash
set -euo pipefail

# Cargar variables de entorno
if [ -f ../.env ]; then
  set -a
  source ../.env
  set +a
fi

# Despliega el backend en Railway usando la CLI de railway.
# Requiere que RAILWAY_TOKEN esté exportado en el entorno.

if [ -z "${RAILWAY_TOKEN:-}" ]; then
  echo "RAILWAY_TOKEN no proporcionado. Abortando despliegue backend." >&2
  exit 1
fi

echo "Desplegando backend en Railway (modo real, no interactivo)..."

# Autenticar con Railway
railway login --token "$RAILWAY_TOKEN"

# Cambiar al directorio del servidor
cd server

# Desplegar en Railway (usa RAILWAY_TOKEN de env)
railway deploy

# Obtener la URL del despliegue
RAILWAY_URL=$(railway domain | grep -o 'https://[^ ]*' | head -1)

if [ -z "$RAILWAY_URL" ]; then
  echo "No se pudo obtener la URL de Railway. Usando URL por defecto." >&2
  RAILWAY_URL="https://praevisio-backend-production.up.railway.app"  # Placeholder
fi

echo "RAILWAY_BACKEND_URL=$RAILWAY_URL"
echo "$RAILWAY_URL" > ../.railway_backend_url

echo "Backend deploy script finished (despliegue real)."
exit 0

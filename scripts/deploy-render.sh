#!/usr/bin/env bash
set -euo pipefail

# Cargar variables de entorno
if [ -f ../.env ]; then
  set -a
  source ../.env
  set +a
fi

# Despliega el backend en Render usando la CLI de render.
# Requiere que RENDER_API_KEY esté exportado en el entorno.
# Asume que el servicio web ya está creado en Render conectado al repo.

if [ -z "${RENDER_API_KEY:-}" ]; then
  echo "RENDER_API_KEY no proporcionado. Abortando despliegue backend." >&2
  exit 1
fi

echo "Desplegando backend en Render..."

# Cambiar al directorio del servidor
cd server

# Desplegar en Render (usa RENDER_API_KEY de env)
# Render CLI: render deploy <service-id>
# Pero para automatizar, usar API o asumir push a branch trigger.

# Para simplicidad, usar render CLI si instalado
if command -v render &> /dev/null; then
  render login --api-key "$RENDER_API_KEY"
  # Asumir SERVICE_ID definido en env
  if [ -z "${RENDER_SERVICE_ID:-}" ]; then
    echo "RENDER_SERVICE_ID no definido. Define el ID del servicio Render." >&2
    exit 1
  fi
  render deploy "$RENDER_SERVICE_ID"
else
  echo "Render CLI no instalado. Instala con: npm install -g render-cli" >&2
  exit 1
fi

# Obtener la URL del despliegue
# Render no tiene comando directo para obtener URL, usar API o asumir
RENDER_URL="${RENDER_BACKEND_URL:-https://praevisio-backend.onrender.com}"  # Placeholder, actualizar manualmente

echo "RENDER_BACKEND_URL=$RENDER_URL"
echo "$RENDER_URL" > ../.render_backend_url

echo "Backend deploy script finished (despliegue en Render)."
exit 0
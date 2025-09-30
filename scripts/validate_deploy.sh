#!/usr/bin/env bash
set -euo pipefail

# Script sencillo de validación post-despliegue.
# Requiere: RAILWAY_BACKEND_URL y VERCEL_URL en el entorno.

BACKEND_URL="${RAILWAY_BACKEND_URL:-}"
FRONTEND_URL="${VERCEL_URL:-}"

if [ -z "$BACKEND_URL" ]; then
  echo "RAILWAY_BACKEND_URL no definido. Exporta RAILWAY_BACKEND_URL." >&2
  exit 2
fi
if [ -z "$FRONTEND_URL" ]; then
  echo "VERCEL_URL no definido. Exporta VERCEL_URL." >&2
  exit 2
fi

echo "Comprobando backend: https://$BACKEND_URL/api/platform-status"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$BACKEND_URL/api/platform-status")
if [ "$HTTP_CODE" -ne 200 ]; then
  echo "Error: backend respondió con código $HTTP_CODE" >&2
  exit 3
fi
echo "Backend OK (200)."

echo "Comprobando frontend: $FRONTEND_URL"
HTTP_CODE_F=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [ "$HTTP_CODE_F" -ne 200 ]; then
  echo "Error: frontend respondió con código $HTTP_CODE_F" >&2
  exit 4
fi
echo "Frontend OK (200)."

echo "Si tienes Playwright instalado y las pruebas en /playwright, puedes ejecutar:
  npx playwright test playwright/dashboard.spec.ts --project=chromium"

echo "Validación completada con éxito."

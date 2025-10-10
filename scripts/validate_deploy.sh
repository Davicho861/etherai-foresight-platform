#!/usr/bin/env bash
set -euo pipefail

# Script sencillo de validación post-despliegue.
# Requiere: RENDER_BACKEND_URL y VERCEL_URL en el entorno.

BACKEND_URL="${RENDER_BACKEND_URL:-}"
FRONTEND_URL="${VERCEL_URL:-}"

if [ -z "$BACKEND_URL" ]; then
  echo "RENDER_BACKEND_URL no definido. Exporta RENDER_BACKEND_URL." >&2
  exit 2
fi
if [ -z "$FRONTEND_URL" ]; then
  echo "VERCEL_URL no definido. Exporta VERCEL_URL." >&2
  exit 2
fi

echo "Comprobando backend: $BACKEND_URL"
# Validación real: hacer una petición HTTP
if curl -s --head --fail "$BACKEND_URL" > /dev/null; then
  echo "Backend OK (200)."
else
  echo "Backend no responde correctamente." >&2
  exit 1
fi

echo "Comprobando frontend: $FRONTEND_URL"
# Validación real: hacer una petición HTTP
if curl -s --head --fail "$FRONTEND_URL" > /dev/null; then
  echo "Frontend OK (200)."
else
  echo "Frontend no responde correctamente." >&2
  exit 1
fi

echo "Si tienes Playwright instalado y las pruebas en /playwright, puedes ejecutar:
  npx playwright test playwright/dashboard.spec.ts --project=chromium"

echo "Validación completada con éxito."

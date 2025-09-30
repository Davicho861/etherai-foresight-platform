#!/usr/bin/env bash
set -euo pipefail

# Despliega el backend en Railway usando la CLI de railway.
# Requiere que RAILWAY_TOKEN esté exportado en el entorno.

if [ -z "${RAILWAY_TOKEN:-}" ]; then
  echo "RAILWAY_TOKEN no está configurado. Exporta RAILWAY_TOKEN antes de ejecutar." >&2
  exit 1
fi

if ! command -v railway >/dev/null 2>&1; then
  echo "CLI 'railway' no encontrada. Instálala: https://docs.railway.app/develop/cli" >&2
  exit 1
fi

echo "Iniciando despliegue del backend en Railway..."

# Login temporal con token
railway login --apiKey "$RAILWAY_TOKEN"

# Crear proyecto o usar uno existente: dejamos que el usuario seleccione.
echo "Selecciona (o crea) el proyecto Railway para desplegar el backend. Presiona Enter para continuar..."
read -r

# Asumimos Dockerfile.backend en la raíz
if [ ! -f Dockerfile.backend ]; then
  echo "No se encontró Dockerfile.backend en la raíz del repositorio." >&2
  exit 1
fi

echo "Construyendo la imagen Docker localmente (opcional)..."
docker build -f Dockerfile.backend -t praevisio-backend:local .

echo "Creando servicio en Railway y subiendo la imagen..."
# railway up permite desplegar, pero la experiencia puede requerir interacción
railway up --service praevisio-backend || echo "railway up retornó no cero, verifica la interfaz interactiva." >&2

echo "Despliegue backend iniciado. Revisa Railway dashboard para la URL pública y los logs."

#!/usr/bin/env bash
set -euo pipefail

################################################################################
# start-local-beta.sh
#
# Wrapper ligero para levantar el entorno de desarrollo de Praevisio AI usando
# Docker Compose. Este script ya no mezcla instalaciones locales y servidores
# dev; en su lugar delega en Docker para asegurar reproducibilidad.
################################################################################

echo "🚀 Praevisio AI - Launching local environment via Docker Compose"

# Comportamiento:
#  - Construye imágenes y levanta los servicios definidos en docker-compose.yml
#  - Espera a que los servicios estén healthy
#  - Ejecuta prisma seed/migrate dentro del contenedor prisma-seed (si aplica)

# Variables opcionales (se pueden definir en .env):
#  PRAEVISIO_BEARER_TOKEN, DATABASE_URL

if ! command -v docker >/dev/null 2>&1; then
	echo "docker no encontrado en PATH. Instala Docker y vuelve a intentarlo." >&2
	exit 1
fi

echo "Building and starting containers..."
export HOST_UID=$(id -u)
export HOST_GID=$(id -g)
docker-compose up -d --build

echo "Waiting for backend health check..."
# Espera activa: revisa health de backend
until [ "$(docker inspect --format='{{.State.Health.Status}}' praevisio_backend 2>/dev/null || echo 'starting')" = "healthy" ]; do
	printf '.'
	sleep 2
done

echo "Backend healthy. If prisma-seed service exists, it will have run during startup."

echo "All services are up. Frontend should be available at http://localhost:3002"

echo "To stop and remove containers run: docker-compose down"

exit 0

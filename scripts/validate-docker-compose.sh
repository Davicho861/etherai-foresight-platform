#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Validando docker-compose para Praevisio AI"

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker no está instalado o no está en PATH. Instálalo y reintenta."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "ERROR: docker daemon no responde. ¿Está Docker Desktop / daemon corriendo?"
  exit 1
fi

echo "1) Validando sintaxis de docker-compose..."
docker compose config

echo "2) Construyendo imágenes (esto puede tardar)..."
docker compose build --progress=plain

echo "3) Levantando servicios en background..."
docker compose up -d

TOKEN=${PRAEVISIO_BEARER_TOKEN:-demo-token}

echo "4) Esperando healthcheck del backend (/api/platform-status)..."
for i in {1..30}; do
  if curl -s -f -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/platform-status >/dev/null 2>&1; then
    echo "✔ Backend listo en http://localhost:4000"
    break
  fi
  echo "  esperando backend... (intento $i/30)"
  sleep 2
  if [ "$i" -eq 30 ]; then
    echo "⚠️ Backend no respondió a tiempo. Revisa los logs: docker compose logs backend"
    exit 2
  fi
done

echo "5) Verificando frontend (http://localhost:3000)..."
if curl -s -f http://localhost:3000 >/dev/null 2>&1; then
  echo "✔ Frontend accesible en http://localhost:3000"
else
  echo "⚠️ Frontend no responde en http://localhost:3000. Revisa: docker compose logs frontend"
fi

echo "
Stack levantada. Para ver logs en tiempo real: docker compose logs -f
Para derribar el stack y borrar volúmenes: docker compose down --volumes
" 

exit 0

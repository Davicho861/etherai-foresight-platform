#!/usr/bin/env bash
set -euo pipefail

start_ts=$(date +%s)
echo "Esperando a que Postgres esté disponible (dentro del contenedor)..."
for i in {1..60}; do
  if docker-compose exec -T db pg_isready -U praevisio >/dev/null 2>&1; then
    echo "Postgres listo"
    break
  fi
  echo "Postgres no listo, intento $i/60..."
  sleep 2
done

# Espera al backend
echo "Esperando al backend en http://localhost:4000..."
for i in {1..60}; do
  if curl -sS "http://localhost:4000/api/platform-status" -H "Authorization: Bearer ${PRAEVISIO_BEARER_TOKEN:-demo-token}" >/dev/null 2>&1; then
    echo "Backend listo"
    break
  fi
  echo "Backend no listo, intento $i/60..."
  sleep 2
done

# Espera al frontend
echo "Esperando al frontend en http://localhost:3002..."
for i in {1..60}; do
  if curl -sS "http://localhost:3002" >/dev/null 2>&1; then
    echo "Frontend listo"
    break
  fi
  echo "Frontend no listo, intento $i/60..."
  sleep 2
done

end_ts=$(date +%s)
echo "Todos los servicios listos (took $((end_ts-start_ts))s)"

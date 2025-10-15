#!/usr/bin/env bash
# Script para esperar a que un servicio esté saludable antes de continuar
# Uso: bash scripts/wait-for.sh <URL>

URL=$1
TIMEOUT=60  # segundos
INTERVAL=2  # segundos entre checks

if [ -z "$URL" ]; then
  echo "Error: Se requiere una URL como argumento"
  echo "Uso: $0 <URL>"
  exit 1
fi

echo "Esperando a que $URL esté saludable..."

SECONDS=0
while [ $SECONDS -lt $TIMEOUT ]; do
  if curl -sS --fail "$URL" > /dev/null 2>&1; then
    echo "✓ Servicio $URL está saludable"
    exit 0
  fi
  echo "Esperando... ($SECONDS/$TIMEOUT segundos)"
  sleep $INTERVAL
done

echo "✗ Timeout esperando a $URL después de $TIMEOUT segundos"
exit 1
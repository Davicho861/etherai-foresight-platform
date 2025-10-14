#!/bin/bash
echo "Iniciando monitoreo de servicios..."
while true; do
  echo "$(date): Verificando estado de servicios..."
  output=$(docker-compose ps)
  echo "$output"
  if echo "$output" | grep -q "Up.*healthy"; then
    echo "Todos los servicios están healthy: db, neo4j, backend, frontend."
    break
  elif echo "$output" | grep -q "Exit"; then
    echo "Detectado fallo en servicios. Logs específicos:"
    docker-compose logs --tail=50
    exit 1
  else
    echo "Esperando servicios healthy... (reintentando en 10 segundos)"
    sleep 10
  fi
done
echo "Monitoreo completado exitosamente."
#!/bin/bash
set -e

echo "[ENTRYPOINT] Iniciando espera activa para la base de datos..."

# Esperar un poco para que la red Docker esté lista
sleep 5

# Espera hasta que la db esté lista (con límite de tiempo)
for i in {1..30}; do
  if PGPASSWORD=praevisio pg_isready -h db -p 5432 -U praevisio >/dev/null 2>&1; then
    echo "[ENTRYPOINT] Base de datos lista."
    break
  fi
  echo "[ENTRYPOINT] Base de datos no lista, intento $i/30, esperando..."
  sleep 2
done

# Si después de 30 intentos no está lista, salir con error
if ! PGPASSWORD=praevisio pg_isready -h db -p 5432 -U praevisio >/dev/null 2>&1; then
  echo "[ENTRYPOINT] Error: Base de datos no disponible después de esperar."
  exit 1
fi

echo "[ENTRYPOINT] Base de datos lista. Aplicando migraciones..."

# Aplicar migraciones de Prisma
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "[ENTRYPOINT] Migraciones aplicadas. Ejecutando seed..."

# Ejecutar seed
npx prisma db seed --schema=./prisma/schema.prisma

echo "[ENTRYPOINT] Seed completado. Iniciando servidor..."

# Iniciar el servidor Node.js
exec node src/index.js
#!/usr/bin/env bash
# Instalador de dependencias para Debian 12 (requiere sudo)
set -euo pipefail
if [[ $(id -u) -ne 0 ]]; then
  echo "Este script requiere sudo. Ejecuta: sudo $0"
  exit 1
fi

echo "Instalando herramientas base..."
apt-get update -y
apt-get install -y curl ca-certificates gnupg build-essential git

echo "Instalando Node.js (NodeSource Node 20)..."
if ! command -v node >/dev/null 2>&1 || [[ $(node -v) != v20* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

echo "Instalando dependencias del proyecto (raíz y server)..."
cd /home/davicho/etherai-foresight-platform-main
if [ -f package-lock.json ] || [ -f package.json ]; then
  npm ci || npm install
fi
cd server
if [ -f package-lock.json ] || [ -f package.json ]; then
  npm ci || npm install
fi

echo "Generando cliente Prisma (si aplica)..."
if [ -f prisma/schema.prisma ]; then
  cd /home/davicho/etherai-foresight-platform-main/server
  npx prisma generate --schema=./prisma/schema.prisma || true
fi

echo "Instalación de dependencias completada."
echo "Siguientes pasos: sudo make install-service  (habilitar servicio systemd)"

exit 0

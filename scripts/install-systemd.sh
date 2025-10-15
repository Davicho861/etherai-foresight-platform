#!/usr/bin/env bash
# Instalador del servicio systemd para Praevisio (modo nativo)
# Uso: sudo ./scripts/install-systemd.sh

set -euo pipefail
SERVICE_FILE="/home/davicho/etherai-foresight-platform-main/scripts/praevisio-native.service"
SYSTEMD_PATH="/etc/systemd/system/praevisio-native.service"

if [[ $(id -u) -ne 0 ]]; then
  echo "Por favor ejecuta este script con sudo: sudo $0"
  exit 1
fi

# Copiar el unit file
cp -f "$SERVICE_FILE" "$SYSTEMD_PATH"
chmod 644 "$SYSTEMD_PATH"

# Recargar systemd, habilitar y arrancar el servicio
systemctl daemon-reload
systemctl enable --now praevisio-native.service

echo "Servicio instalado y arrancado. Ver estado con: systemctl status praevisio-native.service"

#!/usr/bin/env bash
# Desinstalador del servicio systemd para Praevisio (modo nativo)
# Uso: sudo ./scripts/uninstall-systemd.sh

set -euo pipefail
SYSTEMD_PATH="/etc/systemd/system/praevisio-native.service"

if [[ $(id -u) -ne 0 ]]; then
  echo "Por favor ejecuta este script con sudo: sudo $0"
  exit 1
fi

systemctl stop praevisio-native.service || true
systemctl disable praevisio-native.service || true
rm -f "$SYSTEMD_PATH"
systemctl daemon-reload
systemctl reset-failed

echo "Servicio praevisio-native desinstalado." 

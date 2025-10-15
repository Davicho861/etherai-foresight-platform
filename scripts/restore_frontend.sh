#!/usr/bin/env bash
set -euo pipefail

# restore_frontend.sh
# Restaura los archivos del frontend desde el backup creado durante el trasplante.
# Uso: ./scripts/restore_frontend.sh

BACKUP_DIR="src_backup_1760555893"
if [ ! -d "$BACKUP_DIR" ]; then
  echo "ERROR: Backup directory not found: $BACKUP_DIR" >&2
  exit 1
fi

read -p "Esto sobrescribirá archivos en el repositorio raíz. ¿Continuar? (y/N) " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted by user."; exit 0
fi

echo "Restaurando desde $BACKUP_DIR ..."
# mover archivos del backup al root (excluye ., ..)
for f in "$BACKUP_DIR"/* "$BACKUP_DIR"/.[!.]* "$BACKUP_DIR"/..?*; do
  [ -e "$f" ] || continue
  base=$(basename "$f")
  echo "-> Restaurando $base"
  mv -v "$f" ./
done

echo "Restauración completada. Por favor revisa git status y realiza commit si corresponde."
#!/usr/bin/env bash
set -euo pipefail

# Praevisio-Ares safe purge helper
# This script inventories candidate frontend directories, offers to archive them,
# and prints the exact git/docker commands to permanently remove them.
# It will NOT perform irreversible deletions unless run with --execute and
# with the environment variable CONFIRM_PURGE set to the literal value
# "I_AM_ARES_AND_I_CONFIRM_PURGE".

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
TS=$(date -u +%Y%m%dT%H%M%SZ)
ARCHIVE_DIR="$ROOT_DIR/.archives/praevisio_ares_$TS"

candidates=("frontend" "praevisio_frontend" "webapp" "landing" "site" "public" "packages/frontend")

echo "Praevisio-Ares: inventario seguro de candidatos a purga"
echo "Repositorio raíz: $ROOT_DIR"
echo

found=()
for c in "${candidates[@]}"; do
  if [ -d "$ROOT_DIR/$c" ]; then
    found+=("$c")
  fi
done

if [ ${#found[@]} -eq 0 ]; then
  echo "No se encontraron directorios candidatos entre: ${candidates[*]}"
  echo "Ejecuta 'git status --porcelain' o revisa manualmente antes de proceder."
  exit 0
fi

echo "Se encontraron los siguientes directorios candidatos:"
for f in "${found[@]}"; do
  echo "  - $f"
done

echo
echo "Paso 1 (recomendado): crear rama de backup antes de cambios destructivos:"
echo "  git checkout -b backup/purge-$TS"

echo
echo "Acciones disponibles (no se ejecutarán sin --execute):"
echo "  1) ARCHIVAR: mover los directorios detectados a $ARCHIVE_DIR (seguros, reversibles)"
echo "  2) PREPARAR BORRADO: mostrar comandos 'git rm -rf' que podrías ejecutar manualmente"
echo "  3) DOCKER: mostrar comandos de limpieza (stop/rm/prune) — NO se ejecutan"

if [ "${1:-}" != "--execute" ]; then
  echo
  echo "Modo seguro: mostrando acciones sugeridas (sin ejecutar). Para ejecutar, vuelve a correr con --execute AND export CONFIRM_PURGE='I_AM_ARES_AND_I_CONFIRM_PURGE'"

  echo
  echo "Comando para archivar (reversible):"
  echo "  mkdir -p '$ARCHIVE_DIR' && git mv ${found[*]/#/$ROOT_DIR/} '$ARCHIVE_DIR/' || mv ${found[*]/#/$ROOT_DIR/} '$ARCHIVE_DIR/'"

  echo
  echo "Comandos 'git' para eliminar (irrevocable si se confirma):"
  for f in "${found[@]}"; do
    echo "  git rm -rf -- '$f'"
  done

  echo
  echo "Comandos Docker de limpieza sugeridos (NO EJECUTAR automáticamente):"
  echo "  docker stop \\$(docker ps -aq) || true"
  echo "  docker rm \\$(docker ps -aq) || true"
  echo "  docker volume prune -f"
  echo "  docker network prune -f"
  echo "  docker system prune -af"

  exit 0
fi

# If we reach here, user passed --execute. Now require the magic env var.
if [ "${CONFIRM_PURGE:-}" != "I_AM_ARES_AND_I_CONFIRM_PURGE" ]; then
  echo "Ejecución solicitada pero CONFIRM_PURGE no establecido correctamente. Aborting."
  echo "Setea: export CONFIRM_PURGE='I_AM_ARES_AND_I_CONFIRM_PURGE' y vuelve a ejecutar con --execute"
  exit 2
fi

echo "Archivando directorios en: $ARCHIVE_DIR"
mkdir -p "$ARCHIVE_DIR"
for f in "${found[@]}"; do
  if git ls-files --error-unmatch -- "$f" >/dev/null 2>&1; then
    echo "  git mv '$f' '$ARCHIVE_DIR/'"
    git mv -- "$f" "$ARCHIVE_DIR/"
  else
    echo "  mv '$f' '$ARCHIVE_DIR/'"
    mv -- "$f" "$ARCHIVE_DIR/"
  fi
done

echo "Archivos movidos. Haz un commit de respaldo ahora si lo deseas:"
echo "  git add .archives && git commit -m 'chore: archive old frontend(s) before purge'"

echo
echo "Ahora se muestran los comandos Docker de limpieza listos para ser ejecutados. EJECUTAR BAJO TU RESPONSABILIDAD."
echo
echo "  docker stop \\$(docker ps -aq) || true"
echo "  docker rm \\$(docker ps -aq) || true"
echo "  docker volume prune -f"
echo "  docker network prune -f"
echo "  docker system prune -af"

echo
echo "Si quieres que el script ejecute también los comandos Docker, vuelve a ejecutar con --execute-docker (no recomendado en entornos compartidos)."

exit 0

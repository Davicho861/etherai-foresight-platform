#!/usr/bin/env bash
set -euo pipefail

# scripts/aion_commit_and_pr.sh
# Helper seguro para commitear el último IMMORTAL_EVOLUTION_REPORT_*.md en una rama aion/evolution-<ts>
# Dry-run por defecto. Opciones:
#   --push       : push al remote origin (se requiere que el repo tenga origin configurado)
#   --pr         : crear PR usando 'gh' CLI (debe estar instalado y autenticado)
#   --force      : forzar acciones (no recomendado)

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DRY_RUN=true
DO_PUSH=false
DO_PR=false
FORCE=false

for arg in "$@"; do
  case "$arg" in
    --push)
      DO_PUSH=true
      ;;
    --pr)
      DO_PR=true
      ;;
    --no-dry-run)
      DRY_RUN=false
      ;;
    --force)
      FORCE=true
      ;;
    --help|-h)
      echo "Usage: $0 [--push] [--pr] [--no-dry-run] [--force]"
      exit 0
      ;;
  esac
done

cd "$REPO_ROOT"

# Encontrar último IMMORTAL report por timestamp en nombre
REPORT=$(ls -1 IMMORTAL_EVOLUTION_REPORT_*.md 2>/dev/null | sort -r | head -n1 || true)
if [[ -z "$REPORT" ]]; then
  echo "No se encontró ningún IMMORTAL_EVOLUTION_REPORT_*.md en $REPO_ROOT" >&2
  exit 2
fi

ts=$(date -u +%Y%m%dT%H%M%SZ)
BRANCH="aion/evolution-${ts}"

if $DRY_RUN; then
  echo "DRY RUN: Preparando acciones para $REPORT"
  echo "Simulando: git checkout -b $BRANCH"
  echo "Simulando: git add $REPORT && git commit -m 'feat(aion): immortal report $ts'"
  if $DO_PUSH; then
    echo "Simulando: git push origin $BRANCH"
  fi
  if $DO_PR; then
    echo "Simulando: gh pr create --fill --base main --head $BRANCH"
  fi
  exit 0
fi

# Ejecutar acciones reales (solo si no dry-run)

git status --porcelain || true

git checkout -b "$BRANCH"
git add "$REPORT"
git commit -m "feat(aion): immortal report $ts"

if $DO_PUSH; then
  echo "Pushing to origin $BRANCH"
  git push origin "$BRANCH"
fi

if $DO_PR; then
  if command -v gh >/dev/null 2>&1; then
    echo "Creando PR con gh cli"
    gh pr create --fill --base main --head "$BRANCH"
  else
    echo "gh CLI no encontrado; no se puede crear PR automáticamente" >&2
  fi
fi

echo "Completed"

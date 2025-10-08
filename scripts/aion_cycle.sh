#!/usr/bin/env bash
# scripts/aion_cycle.sh
# Genera un EVOLUTION_REPORT_<timestamp>.md, crea una rama `aion/evolution-<timestamp>`, añade y hace commit.
# Por defecto corre en modo dry-run: no hace push ni PR.

set -euo pipefail

DRY_RUN=true
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

usage() {
  cat <<EOF
Usage: $0 [--no-dry-run]

Options:
  --no-dry-run   Ejecuta acciones Git (crear branch, commit). Por seguridad no hace push por defecto.
EOF
}

if [[ ${1:-} == "--no-dry-run" ]]; then
  DRY_RUN=false
fi

timestamp() {
  date -u +%Y%m%dT%H%M%SZ
}

main() {
  ts=$(timestamp)
  report="${REPO_ROOT}/EVOLUTION_REPORT_${ts}.md"

  cat > "$report" <<EOF
# EVOLUTION REPORT ${ts}

Generado por: Aion (script automático)
Timestamp: ${ts}

Resumen: Ciclo autónomo generado por `scripts/aion_cycle.sh` en modo "${DRY_RUN}".

EOF

  branch="aion/evolution-${ts}"

  echo "Report generado: $report"
  echo "Preparando branch: $branch"

  pushd "$REPO_ROOT" > /dev/null
  git status --porcelain || true

  if $DRY_RUN; then
    echo "DRY RUN: no se ejecutarán acciones destructivas." 
    echo "Simulando: git checkout -b $branch"
    echo "Simulando: git add $(basename "$report") && git commit -m 'feat(aion): evolution report ${ts}'"
  else
    git checkout -b "$branch"
    git add "$(basename "$report")"
    git commit -m "feat(aion): evolution report ${ts}"
    echo "Branch creado y commit realizado en $branch"
    echo "Siguiente paso sugerido: git push origin $branch && gh pr create --fill --base main --head $branch"
  fi

  popd > /dev/null
}

main "$@"

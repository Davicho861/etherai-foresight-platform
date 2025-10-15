#!/usr/bin/env bash
# scripts/aion_cycle.sh
# Genera un EVOLUTION_REPORT_<timestamp>.md, crea una rama `aion/evolution-<timestamp>`, añade y hace commit.
# Por defecto corre en modo dry-run: no hace push ni PR.

set -euo pipefail

DRY_RUN=true
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Flags adicionales
NO_GENERATE_REPORT=false
NO_COMMIT=false
NO_HEALTH_CHECK=false

usage() {
  cat <<EOF
Usage: $0 [--no-dry-run]

Options:
  --no-dry-run   Ejecuta acciones Git (crear branch, commit). Por seguridad no hace push por defecto.
EOF
}

for arg in "$@"; do
  case "$arg" in
    --no-dry-run)
      DRY_RUN=false
      ;;
    --no-generate-report)
      NO_GENERATE_REPORT=true
      ;;
    --no-commit)
      NO_COMMIT=true
      DRY_RUN=true
      ;;
    --no-health-check)
      NO_HEALTH_CHECK=true
      ;;
    --help|-h)
      usage
      exit 0
      ;;
  esac
done

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

  # Ejecutar health-check-wrapper antes de cualquier commit (a menos que se pida omitirlo)
  if [[ "$NO_HEALTH_CHECK" == "true" ]]; then
    echo "[aion_cycle] --no-health-check: omitiendo health-check"
  else
    if [[ -x "scripts/health-check-wrapper.sh" ]]; then
      echo "[aion_cycle] Ejecutando health-check-wrapper.sh"
      if ! bash scripts/health-check-wrapper.sh; then
        echo "[aion_cycle] health-check falló. Abortando." >&2
        popd > /dev/null
        exit 3
      fi
    else
      echo "[aion_cycle] health-check-wrapper.sh no encontrado o no ejecutable - abortando" >&2
      popd > /dev/null
      exit 4
    fi
  fi

  # Generar reporte inmortal (opcional)
  if [[ "$NO_GENERATE_REPORT" != "true" ]]; then
    if command -v python3 >/dev/null 2>&1 && [[ -f "scripts/generate_report.py" ]]; then
      OUT="IMMORTAL_EVOLUTION_REPORT_${ts}.md"
      python3 scripts/generate_report.py --output "$OUT"
      echo "[aion_cycle] Reporte inmortal generado: $OUT"
    else
      echo "[aion_cycle] Generador de reportes no disponible (python3 o scripts/generate_report.py) - omitiendo"
    fi
  else
    echo "[aion_cycle] --no-generate-report: omitiendo generación de reporte"
  fi

  # Commit (opcional)
  if [[ "$NO_COMMIT" == "true" ]]; then
    echo "[aion_cycle] --no-commit: omitiendo creación de branch/commit"
  else
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
  fi

  popd > /dev/null
}

main "$@"

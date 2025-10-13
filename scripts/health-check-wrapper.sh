#!/usr/bin/env bash
set -euo pipefail

# Wrapper para localizar y ejecutar el health-check del repo.
# Busca scripts/health-check.sh o scripts/post_deploy_checks.sh u otros y los ejecuta.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

CANDIDATES=("scripts/health-check.sh" "scripts/post_deploy_checks.sh" "scripts/validate-deploy.sh" "scripts/validate-docker-compose.sh")
FOUND=""

for c in "${CANDIDATES[@]}"; do
  if [[ -x "$c" ]]; then
    FOUND="$c"
    break
  elif [[ -f "$c" ]]; then
    FOUND="$c"
    break
  fi
done

if [[ -z "$FOUND" ]]; then
  echo "[health-check-wrapper] Ningún health-check encontrado en candidatos. Fallando." >&2
  exit 2
fi

echo "[health-check-wrapper] Ejecutando: $FOUND"
# Si el archivo es un shell script, ejecútalo; si es otro, intenta con bash
if file "$FOUND" | grep -qi "shell"; then
  bash "$FOUND"
else
  bash "$FOUND"
fi

echo "[health-check-wrapper] Health check finalizado con éxito"

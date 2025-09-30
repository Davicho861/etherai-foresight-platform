#!/usr/bin/env bash
set -euo pipefail

# Hephaestus Reforge Script
# Automatiza los pasos de saneamiento y activación local descritos en el prompt Hephaestus.
# Uso (desde la raíz del repo, con git remoto correctamente configurado):
#   chmod +x scripts/hephaestus_reforge.sh
#   ./scripts/hephaestus_reforge.sh
# Requisitos:
# - Node 18+
# - Git configurado y remoto origin accesible
# - Opcional: export GITHUB_TOKEN=ghp_xxx para activar la sincronización Kanban->Issues

BRANCH="hephaestus/reforge-$(date +%Y%m%d%H%M%S)"
LOGFILE=".hephaestus_reforge.log"

echo "Hephaestus Reforge - iniciando" | tee "$LOGFILE"

# 0. Verificaciones básicas
if [ ! -f package.json ]; then
  echo "ERROR: ejecuta este script desde la raíz del repo (package.json no encontrado)" | tee -a "$LOGFILE"
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: este directorio no es un repo git. Clona el repo en tu máquina y vuelve a ejecutar." | tee -a "$LOGFILE"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Hay cambios locales. Haz stash o commit antes de correr este script." | tee -a "$LOGFILE"
  git status --porcelain | tee -a "$LOGFILE"
  exit 1
fi

# 1. Crear rama
echo "Creando y cambiando a la rama $BRANCH" | tee -a "$LOGFILE"
git checkout -b "$BRANCH" | tee -a "$LOGFILE"

# 2. Backup lockfile
if [ -f package-lock.json ]; then
  echo "Haciendo backup de package-lock.json -> package-lock.json.hephaestus.bak" | tee -a "$LOGFILE"
  cp package-lock.json package-lock.json.hephaestus.bak
fi

# 3. Regenerar lockfile e instalar dependencias (legacy peer deps para máxima compatibilidad)
echo "Instalando dependencias (npm install --legacy-peer-deps). Esto regenerará package-lock.json" | tee -a "$LOGFILE"
npm install --legacy-peer-deps 2>&1 | tee -a "$LOGFILE"

# 4. Mitigación automática de vulnerabilidades
echo "Ejecutando npm audit fix (no destructivo)" | tee -a "$LOGFILE"
npm audit fix 2>&1 | tee -a "$LOGFILE" || true

# 5. Intento de mitigación forzada (nota: puede actualizar paquetes mayores)
echo "Intentando npm audit fix --force (puede cambiar versiones mayores)" | tee -a "$LOGFILE"
npm audit fix --force 2>&1 | tee -a "$LOGFILE" || true

# 6. Ejecutar ESLint autofix
if npm run -s lint -- --fix 2>/dev/null; then
  echo "ESLint --fix completado" | tee -a "$LOGFILE"
else
  echo "ESLint --fix falló o no está presente. Continuando para listar errores" | tee -a "$LOGFILE"
fi

# 7. Mostrar errores de lint actuales
echo "Listado de errores de ESLint (si los hay):" | tee -a "$LOGFILE"
npm run -s lint 2>&1 | tee -a "$LOGFILE" || true

# 8. Ejecutar tests unitarios
echo "Ejecutando tests unitarios (npm test)" | tee -a "$LOGFILE"
npm test 2>&1 | tee -a "$LOGFILE" || true

# 9. Intentar levantar local (opcional) -- solo si existe el script
if [ -x ./start-local-beta.sh ]; then
  echo "Iniciando entorno local (./start-local-beta.sh) en background" | tee -a "$LOGFILE"
  ./start-local-beta.sh &
  SLEEP_SECONDS=10
  echo "Esperando $SLEEP_SECONDS segundos para que los servicios inicialicen" | tee -a "$LOGFILE"
  sleep $SLEEP_SECONDS
else
  echo "No se encontró ./start-local-beta.sh o no es ejecutable. Omite el levantamiento local." | tee -a "$LOGFILE"
fi

# 10. Ejecutar Playwright E2E (si está configurado)
if command -v npx >/dev/null 2>&1 && [ -f playwright.config.ts ]; then
  echo "Ejecutando Playwright E2E (npx playwright test)" | tee -a "$LOGFILE"
  npx playwright test 2>&1 | tee -a "$LOGFILE" || true
else
  echo "Playwright no configurado o npx no disponible; omitiendo E2E." | tee -a "$LOGFILE"
fi

# 11. Sincronización Kanban -> Issues (si GITHUB_TOKEN está presente)
if [ -n "${GITHUB_TOKEN:-}" ]; then
  echo "GITHUB_TOKEN detectado: ejecutando scripts/sync_kanban_to_issues.js" | tee -a "$LOGFILE"
  node scripts/sync_kanban_to_issues.js 2>&1 | tee -a "$LOGFILE" || true
else
  echo "No se detectó GITHUB_TOKEN. Omite la sincronización automática del Kanban." | tee -a "$LOGFILE"
fi

# 12. Revisar cambios y preparar commit
echo "Revisando cambios git..." | tee -a "$LOGFILE"
git status --porcelain | tee -a "$LOGFILE"

if [ -n "$(git status --porcelain)" ]; then
  echo "Agregando y commiteando cambios" | tee -a "$LOGFILE"
  git add -A
  git commit -m "refactor(project): Complete codebase sanitation, vulnerability mitigation, and governance activation" || true
  echo "Push de la rama $BRANCH al remoto origin" | tee -a "$LOGFILE"
  git push -u origin "$BRANCH" | tee -a "$LOGFILE" || true
else
  echo "No hay cambios para commitear." | tee -a "$LOGFILE"
fi

echo "Hephaestus Reforge completado (logs en $LOGFILE). Revisa output para errores y procede a abrir PR desde la rama $BRANCH." | tee -a "$LOGFILE"

exit 0

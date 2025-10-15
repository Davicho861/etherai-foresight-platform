#!/usr/bin/env bash
# Atlas - Script de ignición final (interactivo y seguro)
# Uso: revisar y ejecutar manualmente. No usa secrets ni realiza acciones sin confirmación explícita.

set -euo pipefail
IFS=$'\n\t'

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$(pwd)")"
WORKFLOW_NAME="Praevisio - CI/CD Global Sync"

function abort() {
  echo "\n[Atlas] Abortando. $*" >&2
  exit 1
}

function check_deps() {
  command -v git >/dev/null 2>&1 || abort "Necesitas git instalado."
  command -v gh >/dev/null 2>&1 || echo "Aviso: no se detectó 'gh' (GitHub CLI). Podrás hacer push, pero la monitorización automática no estará disponible."
}

function confirm() {
  local prompt="$1"
  local reply
  read -r -p "$prompt [sí/no]: " reply
  case "$reply" in
    s|S|si|sí|Si|Sí) return 0 ;;
    *) return 1 ;;
  esac
}

function show_plan() {
  echo "\n===== ATLAS - Plan de Ignición (resumen) ====="
  echo "Repositorio: $REPO_ROOT"
  echo "Branch objetivo: main"
  echo "Workflow objetivo: $WORKFLOW_NAME"
  echo "Acción que se realizará (si confirmas):"
  echo "  1) Crear un commit vacío: git commit --allow-empty -m 'chore(ci): Atlas - Initiating Final Ignition'"
  echo "  2) Push forzado a 'origin main': git push origin main --force"
  echo "\nEl script NO toca secrets ni ejecuta despliegues por sí mismo. Solo activa el pipeline realizando el push." 
  echo "==============================================\n"
}

function ensure_clean_worktree() {
  if [[ -n "$(git status --porcelain)" ]]; then
    echo "Tu árbol de trabajo tiene cambios sin confirmar. Se recomienda limpiar o stashear antes de proceder."
    if confirm "¿Deseas continuar de todos modos?"; then
      echo "Procediendo con cambios sin confirmar (riesgoso)."
    else
      abort "Limpia el árbol de trabajo y vuelve a ejecutar." 
    fi
  fi
}

function ensure_branch_main() {
  local branch
  branch=$(git rev-parse --abbrev-ref HEAD)
  if [[ "$branch" != "main" ]]; then
    echo "Actualmente estás en la rama '$branch'. Se recomienda ejecutar la ignición desde 'main'."
    if confirm "¿Cambiar a 'main' y continuar?"; then
      git checkout main || abort "No se pudo cambiar a main."
    else
      abort "Operación cancelada: usa la rama 'main' o vuelve cuando estés listo."
    fi
  fi
}

function do_ignite() {
  echo "Creando commit vacío de ignición..."
  git commit --allow-empty -m "chore(ci): Atlas - Initiating Final Ignition"
  echo "Empujando a origin main (forzado)..."
  git push origin main --force
  echo "Push realizado. El workflow de GitHub Actions debería iniciarse automáticamente si está habilitado."
}

function monitor_with_gh() {
  if ! command -v gh >/dev/null 2>&1; then
    echo "gh no está disponible. Omite la monitorización automática. Usa 'gh' para revisar los runs manualmente." 
    return
  fi

  echo "Buscando el último run del workflow '$WORKFLOW_NAME' en la rama main..."
  local run_id
  run_id=$(gh run list --workflow "$WORKFLOW_NAME" --branch main --limit 1 --json databaseId --jq '.[0].databaseId' 2>/dev/null || true)
  if [[ -z "$run_id" ]]; then
    echo "No se encontró un run reciente. Usa: gh run list --workflow \"$WORKFLOW_NAME\" --branch main" 
    return
  fi

  echo "Último run detectado: $run_id"
  echo "Puedes ver logs con: gh run view $run_id --log"

  if confirm "¿Deseas seguir el run y ver los logs ahora?"; then
    gh run view "$run_id" --log || echo "Error al obtener logs con gh." 
  else
    echo "Monitorización automática omitida."
  fi
}

function usage() {
  cat <<EOF
Uso: $(basename "$0") [--simulate] [--monitor]

Opciones:
  --simulate  : Muestra el plan sin ejecutar commit/push.
  --monitor   : Si 'gh' está disponible, intentará mostrar el último run y logs.
  -h, --help  : Muestra esta ayuda.
EOF
}

# ---- main ----
SIMULATE=false
DO_MONITOR=false

while (( "$#" )); do
  case "$1" in
    --simulate) SIMULATE=true; shift ;;
    --monitor) DO_MONITOR=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Opción desconocida: $1"; usage; exit 2 ;;
  esac
done

check_deps
cd "$REPO_ROOT"
show_plan

if ! confirm "¿Confirmas que autorizas a Atlas a crear el commit vacío y hacer push forzado a 'main'?"; then
  abort "Ignición no autorizada por el usuario."
fi

ensure_clean_worktree
ensure_branch_main

if [[ "$SIMULATE" == true ]]; then
  echo "Modo simulación: No se creará el commit ni se hará push. Fin." 
  exit 0
fi

do_ignite

if [[ "$DO_MONITOR" == true ]]; then
  monitor_with_gh
else
  echo "Si deseas monitorear con la CLI de GitHub, ejecuta:"
  echo "  gh run list --workflow \"$WORKFLOW_NAME\" --branch main"
  echo "  gh run view <run-id> --log"
fi

echo "\n[Atlas] Secuencia de ignición completada (trigger enviado). Revisa GitHub Actions y los despliegues en tu proveedor elegido."

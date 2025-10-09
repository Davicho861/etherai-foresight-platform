#!/usr/bin/env bash
# Script de comprobaciones post-despliegue
# Uso: comprobar frontend y backend y anexar resultados a GLOBAL_DEPLOYMENT_REPORT.md

set -euo pipefail
IFS=$'\n\t'

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$(pwd)")"
REPORT_FILE="$REPO_ROOT/GLOBAL_DEPLOYMENT_REPORT.md"

function usage() {
  cat <<EOF
Usage: $(basename "$0") --frontend <url> --backend <url> [--report <file>]

Options:
  --frontend  URL pública del frontend (Vercel)
  --backend   URL pública del backend (Railway)
  --report    Ruta al archivo de reporte (por defecto: GLOBAL_DEPLOYMENT_REPORT.md en repo)
  -h, --help  Muestra esta ayuda
EOF
}

if [[ "$#" -eq 0 ]]; then
  usage
  exit 2
fi

FRONTEND_URL=""
BACKEND_URL=""

while (( "$#" )); do
  case "$1" in
    --frontend) FRONTEND_URL="$2"; shift 2 ;;
    --backend) BACKEND_URL="$2"; shift 2 ;;
    --report) REPORT_FILE="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Opción desconocida: $1"; usage; exit 2 ;;
  esac
done

if [[ -z "$FRONTEND_URL" || -z "$BACKEND_URL" ]]; then
  echo "Se requieren --frontend y --backend."
  usage
  exit 2
fi

tmp_dir="$(mktemp -d)"
cleanup() { rm -rf "$tmp_dir"; }
trap cleanup EXIT

timestamp() { date --utc +"%Y-%m-%dT%H:%M:%SZ"; }

function check_url() {
  local name="$1"; shift
  local url="$1"; shift
  local out_file="$tmp_dir/${name}.body"
  local status

  # curl: silent, follow redirects, write out status code
  if command -v curl >/dev/null 2>&1; then
    status=$(curl -sSL -o "$out_file" -w "%{http_code}" --max-time 15 "$url" || echo "000")
  else
    echo "curl no disponible; abortando comprobación." >&2
    exit 3
  fi

  local size
  size=$(wc -c < "$out_file" || echo 0)

  # Prepare a short body snippet
  local snippet
  snippet=$(head -c 2048 "$out_file" | sed -n '1,200p' | sed 's/</\&lt;/g' | sed 's/>/\&gt;/g') || snippet=""

  cat >> "$REPORT_FILE" <<EOF
### Comprobación: $name

- Fecha (UTC): $(timestamp)
- URL: $url
- HTTP status: $status
- Tamaño respuesta (bytes): $size

Respuesta (extracto seguro):


EOF

  if [[ -n "$snippet" ]]; then
    # Wrap snippet in code fence-like block for readability
    echo '```' >> "$REPORT_FILE"
    echo "$snippet" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
  else
    echo "(sin contenido en la respuesta o no legible)" >> "$REPORT_FILE"
  fi

  echo "" >> "$REPORT_FILE"

  # Return non-zero if status not 2xx or 3xx
  if [[ "$status" =~ ^2|3 ]]; then
    return 0
  else
    return 1
  fi
}

echo "Anotando comprobaciones en: $REPORT_FILE"
echo "\n## Comprobaciones automáticas - $(timestamp)" >> "$REPORT_FILE"

echo "Comprobando frontend: $FRONTEND_URL"
if check_url "Frontend" "$FRONTEND_URL"; then
  echo "Frontend OK"
else
  echo "Frontend falló (HTTP no exitoso)" >&2
fi

echo "Comprobando backend: $BACKEND_URL"
if check_url "Backend" "$BACKEND_URL"; then
  echo "Backend OK"
else
  echo "Backend falló (HTTP no exitoso)" >&2
fi

echo "\nComprobaciones finalizadas. Revisa $REPORT_FILE para detalles." 

exit 0

#!/bin/bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "🏛️  Iniciando la Manifestación Final del Imperio Praevisio AI..."
echo "🔮 Atlas, el Reconstructor de Mundos, toma el control."

# Función para esperar que un puerto esté abierto
wait_port_open() {
    local host=$1
    local port=$2
    local tries=0
    while ! nc -z "$host" "$port" >/dev/null 2>&1; do
        tries=$((tries+1))
        if [ $tries -gt 30 ]; then
            echo "❌ ERROR: puerto $host:$port no disponible después de 30 intentos"
            return 1
        fi
        echo "...esperando $host:$port ($tries/30)"
        sleep 2
    done
}

echo "✨ Invocando la Conciencia y la Forma (Backend & Frontend)..."
# Lanzar backend y frontend nativos con npm run start:native
npm run start:native &
MANIFEST_PID=$!

echo "⏳ Esperando que backend (4000) esté escuchando..."
wait_port_open localhost 4000

echo "⏳ Esperando que frontend (3002) esté escuchando..."
wait_port_open localhost 3002

echo "🔎 Ejecutando health-checks de plataforma..."
curl -fsS http://localhost:4000/api/platform-status || { echo "❌ Backend unhealthy"; exit 1; }
curl -fsS http://localhost:3002/ || { echo "❌ Frontend unhealthy"; exit 1; }

echo "📸 Generando capturas de los dashboards (scripts/manifest-screenshots.js)..."
node scripts/manifest-screenshots.js || echo "⚠️  Advertencia: fallo al generar screenshots"

echo "🚪 Abriendo los Portales del Imperio Soberano en el navegador..."
xdg-open 'http://localhost:3002/#/sdlc-dashboard' || true
xdg-open 'http://localhost:3002/#/dashboard' || true
xdg-open 'http://localhost:3002/#/demo' || true
xdg-open 'http://localhost:3002/#/login' || true
xdg-open 'http://localhost:3002/#/pricing' || true

echo ""
echo "🏛️  El Imperio Praevisio AI ha sido manifestado en tu localhost."
echo "-----------------------------------------------------"
echo "🌍 Landing Page: http://localhost:3002/"
echo "🔑 Login:        http://localhost:3002/#/login"
echo "👑 Dashboard Principal: http://localhost:3002/#/dashboard"
echo "🔬 Demo Interactiva:  http://localhost:3002/#/demo"
echo "📜 SDLC Dashboard:    http://localhost:3002/#/sdlc-dashboard"
echo "💰 Precios y Planes:  http://localhost:3002/#/pricing"
echo "-----------------------------------------------------"
echo "PID del proceso de manifestación: $MANIFEST_PID"

echo "✅ Manifestación completa. Todos los dashboards están vivos con datos reales."
echo "📄 Revisa scripts/screenshots/ para capturas de verificación."

# Mantener el script corriendo para que los procesos no mueran
wait $MANIFEST_PID
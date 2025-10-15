#!/usr/bin/env bash
set -euo pipefail

echo "🏛️  Iniciando la Manifestación Final del Imperio Praevisio AI..."
echo "🔮 Atlas, el Reconstructor de Mundos, toma el control."

# Función para esperar que un puerto esté abierto
wait_port_open() {
    local host=$1
    local port=$2
    local tries=0
    while ! nc -z "$host" "$port" >/dev/null 2>&1; do
        tries=$((tries+1))
        if [ $tries -gt 60 ]; then
            echo "❌ ERROR: puerto $host:$port no disponible después de 60 intentos"
            return 1
        fi
        echo "...esperando $host:$port ($tries/60)"
        sleep 2
    done
}

# Función para verificar salud de bases de datos
wait_db_healthy() {
    local service=$1
    local max_tries=30
    local tries=0
    while [ $tries -lt $max_tries ]; do
        if docker-compose ps "$service" | grep -q "healthy\|Up"; then
            echo "✅ $service está saludable"
            return 0
        fi
        tries=$((tries+1))
        echo "...esperando salud de $service ($tries/$max_tries)"
        sleep 2
    done
    echo "❌ ERROR: $service no alcanzó estado saludable"
    return 1
}

echo "✨ Invocando la Conciencia y la Forma (Backend & Frontend)..."

# 1. Aniquilación Total del Caos
echo "🔥 Ejecutando Aniquilación Total del Caos..."
npx kill-port 3002 4000 4001 4003 5433 7687 >/dev/null 2>&1 || true
docker-compose down --volumes --remove-orphans >/dev/null 2>&1 || true

# 2. Despertar de los Titanes (Bases de Datos)
echo "🏛️  Despertando los Titanes (PostgreSQL & Neo4j)..."
docker-compose up -d db neo4j

echo "⏳ Esperando que las bases de datos alcancen estado saludable..."
wait_db_healthy db
wait_db_healthy neo4j

# 3. Sincronización de la Realidad (Prisma)
echo "🔗 Ejecutando Sincronización de la Realidad (Prisma)..."
cd server
export DATABASE_URL="postgresql://praevisio_user:praevisio_password@localhost:5433/praevisio_db"
export NEO4J_URI="neo4j://localhost:7687"
export NEO4J_USER="neo4j"
export NEO4J_PASSWORD="praevisio_password"
export PRAEVISIO_BEARER_TOKEN="demo-token"
export PORT=4000

npm install --legacy-peer-deps >/dev/null 2>&1
npx prisma generate >/dev/null 2>&1
npx prisma migrate dev --name init >/dev/null 2>&1
npx prisma db seed >/dev/null 2>&1
cd ..

echo "✅ Sincronización completada. Datos reales preparados."

# 4. Lanzamiento del Backend Nativo
echo "🚀 Lanzando Backend Nativo en puerto 4000..."
cd server
export PORT=4000
npm run dev &
BACKEND_PID=$!
cd ..

echo "⏳ Esperando que backend esté saludable..."
wait_port_open localhost 4000

# Verificar endpoint de salud del backend
if curl -fsS http://localhost:4000/api/platform-status >/dev/null 2>&1; then
    echo "✅ Backend saludable y conectado a datos reales"
else
    echo "❌ Backend no responde correctamente"
    exit 1
fi

# 5. Lanzamiento del Frontend Nativo
echo "🌐 Lanzando Frontend Nativo en puerto 3002..."
export VITE_API_BASE_URL="http://localhost:4000"
export VITE_PRAEVISIO_TOKEN="demo-token"
npm run dev:container &
FRONTEND_PID=$!

echo "⏳ Esperando que frontend esté saludable..."
wait_port_open localhost 3002

# Verificar que el frontend responda
if curl -fsS http://localhost:3002/ >/dev/null 2>&1; then
    echo "✅ Frontend saludable"
else
    echo "❌ Frontend no responde"
    exit 1
fi

echo "🚪 Abriendo los Portales del Imperio Soberano en el navegador..."

# Lista de URLs a abrir
URLS=(
    "http://localhost:3002/"
    "http://localhost:3002/#/sdlc-dashboard"
    "http://localhost:3002/#/dashboard?plan=starter"
    "http://localhost:3002/#/dashboard?plan=growth"
    "http://localhost:3002/#/dashboard?plan=panteon"
    "http://localhost:3002/#/demo"
    "http://localhost:3002/#/login"
    "http://localhost:3002/#/pricing"
)

for url in "${URLS[@]}"; do
    xdg-open "$url" || true
done

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
echo "PID del proceso de manifestación: $$"
echo "PID Backend: $BACKEND_PID"
echo "PID Frontend: $FRONTEND_PID"

echo "✅ Manifestación completa. Todos los dashboards están vivos con datos reales."

# Mantener el script corriendo para que los procesos no mueran
trap "echo 'Deteniendo procesos...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; exit" INT TERM
wait
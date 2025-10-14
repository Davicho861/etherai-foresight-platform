#!/bin/bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "🔮 Despertando los Cimientos del Imperio (PostgreSQL & Neo4j)..."
docker-compose up -d db neo4j

echo "⏳ Esperando a que PostgreSQL esté listo (pg_isready)..."
for i in {1..30}; do
	if docker exec praevisio_db pg_isready -U praevisio_user -d praevisio_db >/dev/null 2>&1; then
		echo "✅ PostgreSQL listo"
		break
	fi
	echo "...esperando postgres ($i/30)"
	sleep 2
done

echo "⏳ Esperando a que Neo4j responda (cypher-shell)..."
for i in {1..30}; do
	if docker exec praevisio_neo4j cypher-shell -u neo4j -p praevisio_password "RETURN 1" >/dev/null 2>&1; then
		echo "✅ Neo4j listo"
		break
	fi
	echo "...esperando neo4j ($i/30)"
	sleep 2
done

echo "✨ Configurando entorno nativo en server/.env ..."
cat > server/.env <<EOF
DATABASE_URL=postgresql://praevisio_user:praevisio_password@localhost:5433/praevisio_db
NEO4J_URI=neo4j://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=praevisio_password
PRAEVISIO_BEARER_TOKEN=demo-token
PORT=4000
EOF

echo "🔧 Ejecutando setup nativo (instalación, prisma generate y seed)..."
npm run native:setup

echo "✨ Invocando la Conciencia y la Forma (Backend & Frontend)..."
# Intentar arrancar con el comando nativo (concurrently). Si falla por falta de 'vite', arrancar frontend manualmente con npx.
npm run start:native &
NATIVE_PID=$!
sleep 3
if ! ps -p $NATIVE_PID >/dev/null 2>&1; then
	echo "Advertencia: fallo al ejecutar start:native, intentando arrancar componentes por separado..."
	# Arrancar backend
	(cd server && export PORT=4003 && nodemon src/index.js) &
	BACKEND_PID=$!
	# Intentar arrancar frontend con npx vite
	(export VITE_PORT=3002 && npx vite) &
	FRONTEND_PID=$!
	MANIFEST_PID=$BACKEND_PID
else
	MANIFEST_PID=$NATIVE_PID
fi

wait_port_open() {
	local host=$1
	local port=$2
	local tries=0
	while ! nc -z "$host" "$port" >/dev/null 2>&1; do
		tries=$((tries+1))
		if [ $tries -gt 30 ]; then
			echo "ERROR: puerto $host:$port no disponible después de muchos intentos"
			return 1
		fi
		echo "...esperando $host:$port ($tries/30)"
		sleep 2
	done
}

echo "⏳ Esperando que backend (4003) esté escuchando en localhost..."
wait_port_open localhost 4003

echo "⏳ Comprobando frontend (3002)..."
if ! wait_port_open localhost 3002; then
	echo "Advertencia: frontend no respondió en 3002 dentro del tiempo esperado. Intentando arrancar frontend manualmente con npx vite..."
	# Intentar iniciar el frontend con npx vite
	(export VITE_PORT=3002 && npx vite) &
	FRONTEND_PID=$!
	# Reintentar esperar a que el puerto abra
	if ! wait_port_open localhost 3002; then
		echo "ERROR: frontend no pudo iniciarse en 3002. Revisa que 'vite' esté instalado o ejecuta 'npm install' en la raíz." 
		exit 1
	fi
fi

echo "🔎 Ejecutando health-checks de plataforma..."
curl -fsS http://localhost:4003/api/platform-status || { echo "Backend unhealthy"; exit 1; }
curl -fsS http://localhost:3002/ || { echo "Frontend unhealthy"; exit 1; }

echo "📸 Generando capturas de los dashboards (scripts/manifest-screenshots.js)..."
node scripts/manifest-screenshots.js || echo "Advertencia: fallo al generar screenshots"

echo "🚪 Abriendo los Portales del Imperio Soberano en el navegador..."
xdg-open 'http://localhost:3002/#/sdlc-dashboard' || true
xdg-open 'http://localhost:3002/#/dashboard' || true
xdg-open 'http://localhost:3002/#/demo' || true

echo "🌍 El Imperio Praevisio AI ha sido manifestado en tu localhost."
echo "PID del proceso de manifestación (concurrently): $MANIFEST_PID"

echo "📄 Generando reporte de manifestación (EMPIRE_MANIFESTATION_REPORT.md)..."
cat > EMPIRE_MANIFESTATION_REPORT.md <<EOF
# EMPIRE MANIFESTATION REPORT

Fecha: $(date -u)

Dashboards verificados:

- /sdlc-dashboard -> scripts/screenshots/sdlc-dashboard.png
- /dashboard -> scripts/screenshots/dashboard.png
- /demo -> scripts/screenshots/demo.png

Notas: Si alguna captura falta, revisa la salida de 'bash scripts/manifest.sh' y ejecuta 'node scripts/manifest-screenshots.js' manualmente.

EOF

echo "✅ Manifestación completa. Revisa EMPIRE_MANIFESTATION_REPORT.md y scripts/screenshots/."
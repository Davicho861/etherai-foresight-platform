echo "🧹 Limpiando puertos 4000 (backend) y 8080 (frontend)..."
echo "📦 Instalando dependencias del backend..."
npm ci
echo "🛠️  Configurando la base de datos Prisma..."
#!/bin/bash

# ===================================================================
# == Praevisio AI - SCRIPT DE LANZAMIENTO LOCAL INMEDIATO (IGNITION) ==
# ===================================================================
# Objetivo: Desplegar el entorno completo de Praevisio AI en local
# con un solo comando. Ágil, robusto y sin dependencias externas.
# -------------------------------------------------------------------

echo "🚀 IGNITION SEQUENCE STARTED... Despliegue local de Praevisio AI."

# --- FASE 1: PREPARACIÓN DEL ENTORNO ---
echo "🧹 [1/4] Limpiando puertos 4000 (backend) y 8080 (frontend)..."
npx kill-port 4000 8080 > /dev/null 2>&1 || echo "Puertos ya libres."

# --- FASE 2: INSTALACIÓN DE DEPENDENCIAS ---
echo "📦 [2/4] Instalando dependencias de forma limpia (npm ci)..."
(cd server && npm ci)
npm ci

# --- FASE 3: CONFIGURACIÓN DE LA BASE DE DATOS ---
echo "🛠️  [3/4] Configurando base de datos Prisma y sembrando datos..."
(cd server && npx prisma generate)
(cd server && npx prisma db push --accept-data-loss)
(cd server && node seed.js)

# --- FASE 4: LANZAMIENTO CONCURRENTE ---
echo "🔥 [4/4] Encendiendo motores... Lanzando backend y frontend."
echo "-----------------------------------------------------------------"
echo "🖥️  Centro de Mando Praevisio AI estará disponible en http://localhost:8080/dashboard"
echo "🕒 Esperando que los servicios estén en línea..."
echo "-----------------------------------------------------------------"

# Abrir el navegador en la URL correcta (funciona en macOS, Linux y WSL)
# Espera 8 segundos para dar tiempo a los servidores a iniciar.
(sleep 8 && xdg-open http://localhost:8080/dashboard) &

# Iniciar ambos servidores con concurrently. Si falla, el script se detendrá.
npx concurrently --kill-others-on-fail "npm:dev --workspace=server" "npm:dev"

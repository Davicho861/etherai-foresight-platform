#!/bin/bash

# PRAEVISIO HEPHAESTUS GEMINI SOUL FORGE - START SOVEREIGN SCRIPT
# Protocolo de Arranque Soberano - Fundación Indestructible

set -e  # Exit on any error

echo "🔥 HEFESTO DESPIERTA - Protocolo de Arranque Soberano Iniciado"

# CONFIGURACIÓN Soberana
BACKEND_PORT=4000
FRONTEND_PORT=3002

# 1. PURGA PREVENTIVA - Eliminar procesos residuales
echo "⚔️  PURGA PREVENTIVA: Eliminando procesos residuales en puertos $BACKEND_PORT y $FRONTEND_PORT"
npx kill-port $BACKEND_PORT $FRONTEND_PORT || true

# 2. IGNICIÓN DEL BACKEND - Lanzar en segundo plano
echo "🏛️  IGNICIÓN DEL BACKEND: Lanzando servidor en puerto $BACKEND_PORT"
cd server && npm run dev &
BACKEND_PID=$!
cd ..

# 3. ESPERA SOBERANA - Verificar que el backend esté vivo
echo "⏳ ESPERA SOBERANA: Esperando a que el backend esté completamente operativo en tcp:$BACKEND_PORT"
npx wait-on tcp:$BACKEND_PORT --timeout 60000

if [ $? -eq 0 ]; then
    echo "✅ BACKEND CONFIRMADO: Puerto $BACKEND_PORT operativo"
else
    echo "❌ ERROR CRÍTICO: Backend no respondió en el tiempo esperado"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# 4. MANIFESTACIÓN DEL FRONTEND - Solo cuando el backend esté confirmado
echo "🌟 MANIFESTACIÓN DEL FRONTEND: Lanzando aplicación en puerto $FRONTEND_PORT"
npm run dev:client

# 5. LIMPIEZA FINAL - Si el frontend termina, limpiar procesos
echo "🧹 LIMPIEZA FINAL: Finalizando procesos"
kill $BACKEND_PID 2>/dev/null || true

echo "🏛️ PROTOCOLO Soberano Completado"
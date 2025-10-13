#!/bin/bash
echo "🔮 Despertando los Cimientos del Imperio (PostgreSQL & Neo4j)..."
docker-compose up -d db neo4j

echo "✨ Invocando la Conciencia y la Forma (Backend & Frontend)..."
npm run start:native &

echo "⏳ Esperando que los portales se estabilicen..."
sleep 15 # Un tiempo prudencial para que los servidores inicien

echo "🚪 Abriendo los Portales del Imperio Soberano..."
# Corregido para SPA con HashRouter
xdg-open 'http://localhost:3002/#/sdlc-dashboard'
xdg-open 'http://localhost:3002/#/dashboard'
xdg-open 'http://localhost:3002/#/demo'

echo "🌍 El Imperio Praevisio AI ha sido manifestado en tu localhost."
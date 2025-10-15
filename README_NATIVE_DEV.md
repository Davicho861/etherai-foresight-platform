# Desarrollo Nativo — Praevisio (Debian 12)

Este documento describe el flujo rápido para ejecutar el proyecto en modo nativo sobre Debian 12 (Prometeo Desencadenado): sin Docker, con SQLite, hot-reload y mocks locales para servicios externos.

Resumen rápido
- Iniciar mocks: `bash ./scripts/start-mocks.sh`
- Iniciar stack en background: `npm run start:background` (usa `NATIVE_DEV_MODE=true` internamente)
- Iniciar stack en foreground (útil para ver logs): `export NATIVE_DEV_MODE=true && npm run start:native`
- Verificar: `bash ./scripts/health-check.sh`

Requisitos mínimos (Debian 12)
- Node.js 20+ (recomendado). Puedes instalarlo con el script `scripts/install-deps-debian.sh` provisto (requiere sudo).
- npm (incluido con Node)

Directorio importante
- `server/` — backend (Express + Prisma). Prisma está configurado para SQLite en `server/prisma/schema.prisma` en el modo nativo.
- `server/mocks/` — mocks locales (World Bank, GDELT, Open-Meteo).
- `scripts/` — scripts de apoyo (`start-native.sh`, `start-mocks.sh`, `health-check.sh`, instalador systemd, etc.)

Flujo detallado (rápido)
1) Instalar dependencias del proyecto (raíz y server):

```bash
# desde la raíz del repo
npm ci
cd server
npm ci
npx prisma generate --schema=./prisma/schema.prisma
cd ..
```

2) Levantar mocks (recomendado primero):

```bash
bash ./scripts/start-mocks.sh
```

3) Levantar la aplicación (opción background — recomendado):

```bash
npm run start:background
```

O en foreground (para desarrollo, ver logs en la terminal):

```bash
export NATIVE_DEV_MODE=true
npm run start:native
```

4) Verificar estado con smoke test:

```bash
bash ./scripts/health-check.sh
```

Notas útiles
- En modo nativo la app exporta `NATIVE_DEV_MODE=true` y evita iniciar servicios externos pesados (Neo4j, Chroma). El backend usa SQLite (`server/prisma/dev.db`).
- Los logs de background se almacenan en `logs/` (ej. `logs/server.log`, `logs/frontend.log`, `logs/mock-*.log`).
- `scripts/start-native.sh` intentará liberar puertos ocupados **solo** si el proceso propietario es el mismo usuario que ejecuta el script (seguro para uso local).

Instalar unit systemd (opcional)
- Hay un instalador preparado: `scripts/install-systemd.sh`. Requiere sudo y te pedirá que verifiques los valores `User` y `WorkingDirectory` antes de instalar. Si quieres, puedo ejecutar la instalación por ti ahora (necesita privilegios).

Instalación/Desinstalación del servicio systemd (rápido)
- Instalar: `sudo ./scripts/install-systemd.sh` (revisa `scripts/praevisio-native.service` y ajusta `User`/`WorkingDirectory` si hace falta)
- Desinstalar: `sudo ./scripts/uninstall-systemd.sh` (remueve el unit y desactiva el servicio)

Detener todo
- Mocks: busca y mata los PIDs de `node server/mocks/*` o reinicia tu sesión.
- Background (server + frontend): `bash ./scripts/stop-native.sh`

Problemas comunes
- EADDRINUSE: Si algún proceso personal está utilizando un puerto necesario, el script intenta liberarlo sólo si te pertenece (usuario). Si el puerto está en uso por otro usuario o proceso del sistema, cambia el puerto con variables `PORT` y `VITE_PORT`.
- Prisma: si cambias el schema, ejecuta `npx prisma generate` y `npx prisma db push` si necesitas sincronizar el schema.

¿Quieres que instale el unit systemd ahora? (necesitaré sudo)
# Praevisio AI — Native Development Manifest

Praevisio AI ahora puede ejecutarse en modo nativo (sin Docker) para desarrollo ultra-rápido y soberano.

Principios:
- Cero Docker en el flujo de desarrollo principal.
- Base de datos ligera: SQLite (archivo `server/prisma/dev.db`).
- Servicios pesados (Neo4j, ChromaDB) desactivados en modo nativo.

Cómo empezar (Linux/macOS):

1. Instala dependencias:

   npm install

2. Inicia en modo nativo (hot-reload para frontend y backend):

   npm run start:native

Esto pondrá la variable de entorno `NATIVE_DEV_MODE=true` para evitar inicializar Neo4j y ChromaDB.

Notas:
- Prisma está configurado para usar SQLite en desarrollo local (`server/prisma/schema.prisma`). Si necesitas regenerar el cliente Prisma:

   cd server && npx prisma generate --schema=./prisma/schema.prisma

- La base de datos SQLite se crea automáticamente en `server/prisma/dev.db` la primera vez que Prisma la usa.
- Los archivos Docker y configuraciones asociadas han sido movidos a `infra_backup/`.

Ignición única (Linux/macOS):

1. Instala dependencias en la raíz y en `server`:

   npm install
   cd server && npm install

2. Genera el cliente Prisma (si no lo hiciste ya):

   cd server && npx prisma generate --schema=./prisma/schema.prisma

3. Enciende la plataforma en modo nativo (frontend + backend con hot-reload):

   npm run start:native

Esto exportará `NATIVE_DEV_MODE=true` y arrancará ambos procesos en paralelo. En este modo:
- La conexión a Neo4j está desactivada y el sistema usa fallbacks en memoria para grafo causal.
- La persistencia de logs en ChromaDB está desactivada y se usa un fallback en memoria.

Si necesitas levantar servicios externos (Neo4j, ChromaDB) para pruebas avanzadas, desactiva `NATIVE_DEV_MODE` y arranca los servicios deseados localmente.

Si necesitas levantar Neo4j o ChromaDB para pruebas avanzadas, puedes hacerlo localmente y desactivar `NATIVE_DEV_MODE`.

Mocks incluidos (modo nativo)
----------------------------
Este repositorio ahora incluye mocks ligeros para algunas APIs externas comunes. Son útiles para ejecutar la plataforma localmente sin depender de redes externas.

- `server/mocks/worldbank-mock.js`  (mock de World Bank)
- `server/mocks/gdelt-mock.js`      (mock de GDELT)
- `server/mocks/open-meteo-mock.js` (mock de Open-Meteo)

Cómo arrancar los mocks (opcional, en otra terminal):

```
# desde la raíz del repo
node server/mocks/worldbank-mock.js &
node server/mocks/gdelt-mock.js &
node server/mocks/open-meteo-mock.js &
```

Los mocks usan puertos por defecto (configurables mediante variables de entorno):
- WORLDBANK_MOCK_PORT (default 4010)
- GDELT_MOCK_PORT (default 4020)
- OPEN_METEO_MOCK_PORT (default 4030)

Con `NATIVE_DEV_MODE=true` la plataforma se conectará automáticamente a estos endpoints locales cuando estén disponibles.

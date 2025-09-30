Praevisio AI - Centro de Mando (Comandos de build y despliegue)

Instrucciones rápidas para ejecutar localmente y preparar despliegue en staging.

Requisitos:
- Node.js 20+
- npm

Desarrollo (Hot Reloading):

1. Instalar dependencias

```bash
npm ci
cd server
npm ci
cd ..
```

2. Iniciar backend (puerto 4000)

```bash
cd server
npm run dev
```

3. Iniciar frontend en modo desarrollo (vite, HMR en puerto 8080)

```bash
npm run dev
```

Build de producción:

```bash
npm run build
# sirve la build localmente para pruebas
npx serve -s dist -l 8080
```

Playwright E2E (requiere backend corriendo en localhost:4000):

```bash
# instala dependencias de Playwright si es necesario
npx playwright install --with-deps
npx playwright test
```

Despliegue rápido sin Docker (Vercel frontend + Railway backend)

Resumen: desplegaremos el backend Node (server/) en Railway y el frontend Vite en Vercel. `vercel.json` redirige llamadas a `/api/*` hacia el backend desplegado.

1) Backend - Railway
- Crear un nuevo proyecto en Railway y conectar el repositorio o desplegar desde GitHub.
- En Railway, establecer la carpeta de inicio a `server` (si se pide) y el comando de start a `npm run start`.
- Variables de entorno mínimas a configurar en Railway:
	- DATABASE_URL (ej: sqlite o PostgreSQL segan su preferencia)
	- PRAEVISIO_BEARER_TOKEN (por ejemplo: `demo-token`)

2) Frontend - Vercel
- Conectar el repositorio en Vercel.
- En Settings > Environment Variables, añadir:
	- VITE_API_BASE_URL = https://<RAILWAY_BACKEND_URL>
- Subir `vercel.json` que contiene las reglas de rewrite para que `/api/*` apunte al backend en Railway. Reemplazar `<RAILWAY_BACKEND_URL>` por la URL real del backend.

3) Scripts y build
- Backend (server/package.json) ya contiene:
	- "start": "node src/index.js"
- Frontend (root package.json) ya contiene:
	- "build": "vite build"

4) Pruebas E2E (opcional)
- Para ejecutar Playwright E2E localmente:
	- Iniciar backend local: `cd server && npm run dev` (puerto 4000)
	- Iniciar frontend dev: `npm run dev` (puerto 8080 por defecto)
	- Ejecutar: `npx playwright test`

5) Notas de seguridad
- Use secrets en Vercel/Railway y no exponga `PRAEVISIO_BEARER_TOKEN` públicamente.

Con esto, en menos de 5 minutos podrás conectar Vercel y Railway y tener una URL pública para el Centro de Mando.

Despliegue Local con Docker (opcional, industrialización)

1) Levantar todo con Docker Compose

```bash
# construir imágenes y levantar servicios en background
docker compose up --build -d

# comprobar estado de servicios
docker compose ps

# ver logs
docker compose logs -f

# parar y limpiar
docker compose down --volumes
```

2) Notas sobre Docker
- El `docker-compose.yml` define dos servicios: `backend` (puerto 4000) y `frontend` (puerto 3000).
- El frontend se construye con `VITE_API_BASE_URL` apuntando a `http://backend:4000` para que use el service name.

Integración CI

El pipeline GitHub Actions (`.github/workflows/ci.yml`) hace:
- `lint_and_test_unit`: instala dependencias, ejecuta lint y tests unitarios.
- `e2e`: construye imágenes con `docker compose build`, levanta servicios, espera que el backend responda en `/api/platform-status`, instala Playwright y ejecuta los tests E2E. Al final hace `docker compose down`.


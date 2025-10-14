# Praevisio AI — Demo Landing & Prototype

## ⚡ Manifiesto Local First

Lee el [Manifiesto Local First](00_LOCAL_FIRST_MANIFESTO.md) - la ley inmutable que rige nuestro dominio y garantiza la soberanía local absoluta.

## Project info

**Project**: Praevisio AI (demo)
**URL**: https://lovable.dev/projects/73a63849-c2d2-404a-b7c3-709f33e7f86c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/73a63849-c2d2-404a-b7c3-709f33e7f86c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Quickstart: Live development (Docker)

Si quieres un entorno reproducible que ejecute frontend, backend, base de datos y un mock LLM dentro de Docker, usa el siguiente flujo. Está diseñado para que el "stack vivo" mantenga servicios en estado healthy y deje las pruebas E2E como una acción explícita.

1. (Sólo la primera vez) Preparar volúmenes y permisos:

```sh
./scripts/bootstrap.sh
```

2. Iniciar el ecosistema vivo:

```sh
npm run dev:live
# Equivalente a: docker-compose up -d --build
```

Notas:
- `prisma-seed` se ejecuta como job de una sola ejecución durante el arranque (migra y seed) y sale con código 0 en éxito, permitiendo que `backend` dependa de su finalización.
- El runner E2E no está corriendo permanentemente en el compose principal; ejecuta las pruebas con `npm run validate` (desde el host o en un contenedor efímero).

3. Ejecutar validaciones (E2E + unit + linters):

```sh
npm run validate
```

`npm run validate` levantará los servicios necesarios y ejecutará Playwright desde el host (preferido) o en un contenedor temporal si no hay `npx`.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Kanban migration (PROJECT_KANBAN.md)

There is a helper to convert the markdown kanban into structured JSON and optionally import it to the running backend.

Generate JSON from `docs/PROJECT_KANBAN.md`:

```bash
npm run generate:kanban
```

This writes `data/kanban.json`.

To import the tasks into the backend (default http://localhost:4000):

```bash
npm run import:kanban
# or with a custom API base
API_BASE=http://localhost:4000 npm run import:kanban
```


## Prompt Maestro

See `PROMPT_MAESTRO.md` for the full "prompt maestro" that defines the product vision, landing page requirements and the LATAM security module scope. Use it to brief dev teams or automate feature generation.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/73a63849-c2d2-404a-b7c3-709f33e7f86c) and click on Share -> Publish.

## Despliegue rápido (Hyperion)

Si quieres lanzar la plataforma a producción usando Docker, Railway y Vercel sigue estos pasos rápidos:

1. Instala dependencias y CLIs necesarias: `railway`, `vercel`, `docker`, `jq`.
2. Copia y edita las variables de entorno:

	cp .env.template .env
	# Rellena RAILWAY_TOKEN, VERCEL_TOKEN, OPENAI_API_KEY, DATABASE_URL y PRAEVISIO_BEARER_TOKEN

3. Despliega el backend (interactivo con Railway):

	./scripts/deploy_backend.sh

	Revisa Railway dashboard y copia la URL pública del servicio (ej. praevisio-backend-prod.up.railway.app)

4. Exporta la URL para uso en el despliegue del frontend:

	export RAILWAY_BACKEND_URL=pr...railway.app

5. Despliega el frontend en Vercel:

	./scripts/deploy_frontend.sh

6. Valida el despliegue (reemplaza con las URLs reales):

	export RAILWAY_BACKEND_URL=pr...railway.app
	export VERCEL_URL=https://your-vercel-app.vercel.app
	./scripts/validate_deploy.sh

Notas:


## Ejecución 100% local (LLM local con Ollama)

Si prefieres ejecutar todo de forma local sin depender de APIs externas (OpenAI, Vercel, Railway), puedes usar Ollama para ejecutar un LLM en tu máquina y validar la pila completa con el script `validate` añadido:

- Instala Ollama siguiendo las instrucciones en https://ollama.ai
- Descarga un modelo localmente (ejemplo):

```
ollama pull llama3
```

- Asegúrate de que Ollama esté corriendo y exponiendo su API en `http://localhost:11434`.
- Puedes exportar variables en `.env` (ver `.env.template`) para apuntar a Ollama:

```
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=llama3
```

- Para validar localmente (levantar Docker, esperar servicios y correr pruebas E2E):

```
npm run validate
```

Este flujo evita el uso de `OPENAI_API_KEY` y hará que el backend utilice el LLM local como respaldo.


## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Governance & Documentation

La documentación estratégica y técnica del proyecto está centralizada en el directorio `docs/`.
- Índice de documentación: `docs/README.md`
- Tablero de gestión (Kanban): `docs/PROJECT_KANBAN.md`

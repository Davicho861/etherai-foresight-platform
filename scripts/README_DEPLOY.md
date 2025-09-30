# Despliegue automático - Guía rápida

Requisitos previos:

- Tener instaladas las CLIs: `railway` y `vercel`.
- Exportar en tu shell las variables: `RAILWAY_TOKEN`, `VERCEL_TOKEN`, `OPENAI_API_KEY` (si procede).
- Tener Docker instalado para construir la imagen localmente.

Pasos rápidos:

1. Copia `.env.template` a `.env` y rellena las variables.

2. Despliegue backend (Railway):

   ./scripts/deploy_backend.sh

   Revisa Railway dashboard para conseguir la URL pública del servicio (ej. praevisio-backend-prod.up.railway.app)

3. Exporta la URL en el entorno para el siguiente script:

   export RAILWAY_BACKEND_URL=pr...railway.app

4. Despliegue frontend (Vercel):

   ./scripts/deploy_frontend.sh

5. Revisa Vercel dashboard para la URL pública del frontend.

Notas:

- Los scripts son una ayuda; Railway y Vercel pueden requerir interacción en CLI para seleccionar proyectos/teams.
- Para un despliegue totalmente no interactivo se necesitaría configurar proyectos y variables de entorno vía las APIs de Railway y Vercel usando sus tokens.

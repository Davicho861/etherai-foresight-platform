Praevisio - CI/CD Deployment README

Resumen
-------
Este repositorio ahora usa un pipeline de GitHub Actions para desplegar automaticamente el backend en Railway y el frontend en Vercel cada vez que se hace push a la rama `main`.

Secrets requeridos en GitHub (Settings > Secrets > Actions):
- RAILWAY_TOKEN : Token API para Railway
- RAILWAY_BACKEND_URL (opcional): URL pública del backend si Railway no la puede inferir
- VERCEL_TOKEN : Token API para Vercel
- VERCEL_URL (opcional): URL pública de Vercel para validación
- SUPABASE_DATABASE_URL : (si aplica) cadena de conexión usada por el frontend en build

Flujo de trabajo
----------------
1. Push a `main` dispara `.github/workflows/main.yml`.
2. Job `Deploy_Backend` despliega el backend en Railway y expone `railway_backend_url` como output.
3. Job `Deploy_Frontend` despliega el frontend en Vercel pasando `RAILWAY_BACKEND_URL` como variable de entorno a la build.
4. Job `Certify_Global_Reality` ejecuta `./scripts/validate_deploy.sh` para comprobar el estado del backend y frontend.

Cómo forzar la sincronización desde local
----------------------------------------
1. Asegúrate de tener los secrets configurados en el repo remoto.
2. Commit y push de tus cambios a `main` (p. ej.):

   git add .
   git commit -m "chore(ci): praevsio hermes global sync"
   git push origin main --force

3. Abre la pestaña Actions en GitHub y monitorea el workflow.

Notas y supuestos
-----------------
- Este README asume que tienes permisos para escribir secrets en el repo remoto.
- Las herramientas Railway y Vercel CLI se ejecutan desde el runner; ambas se instalan dinámicamente durante el job.
- Los scripts locales de Docker y validación han sido deprecados y reemplazados por checks en CI.

Si quieres que yo ejecute el `git push` desde aquí (si me lo autorizas), dime y lo haré.
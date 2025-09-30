# Tokens y secretos para despliegue

Este archivo describe cómo generar y guardar de forma segura los tokens necesarios para el despliegue.

1) PRAEVISIO_BEARER_TOKEN (recomendado):

- Genera localmente un token fuerte. Ejemplo (en tu máquina):

  openssl rand -base64 32

- NO subas este token al repositorio. Guarda el token en el Secret Manager de Railway y en las Variables de Entorno de Vercel.

2) RAILWAY_TOKEN y VERCEL_TOKEN

- Exporta en tu shell antes de ejecutar los scripts:

  export RAILWAY_TOKEN=...
  export VERCEL_TOKEN=...

3) DATABASE_URL

- Provisiona una base de datos Postgres en Railway (desde el dashboard) o usa la CLI para crear una y copia la URL en `DATABASE_URL`.

4) Buenas prácticas

- Usa gestores de secretos integrados de Railway y Vercel.
- No hagas commit de archivos que contengan valores reales de secretos.

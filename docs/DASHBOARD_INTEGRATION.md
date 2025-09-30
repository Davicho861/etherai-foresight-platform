Praevisio Nexus Integration - Quick Run

Este documento resume cómo ejecutar localmente el nuevo dashboard `/dashboard` y verificar el endpoint backend.

1) Backend

- Ir al directorio server:

  cd server
  npm install
  npm run start

El servidor por defecto escucha en http://localhost:4000

2) Frontend

- En la raíz del proyecto:

  npm install
  npm run dev

- Abrir http://localhost:5173/dashboard (o la URL que Vite indique)

3) Autenticación simulada

- El backend usa un token Bearer simple. Por defecto el servidor acepta `demo-token`.
- Para simular un usuario autenticado en el frontend, en la consola del navegador ejecutar:

  localStorage.setItem('praevisio_token', 'demo-token')

4) Pruebas E2E

- El CI ya instala Playwright y ejecuta los tests. Para ejecutar localmente:

  npm i -D @playwright/test
  npx playwright install --with-deps
  npx playwright test playwright/dashboard.spec.ts

Notas:
- El endpoint `/api/dashboard/overview` devuelve un payload de ejemplo que el frontend consume.
- El dashboard ha sido rebrandeado a "Praevisio AI" y los textos generalizados a "Eventos Críticos".

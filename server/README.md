# Praevisio Server — Desarrollo (doc rápida)

Pequeña guía para ejecutar el backend en desarrollo, usar mocks locales y ejecutar pruebas.

## Comandos rápidos

- Arrancar todo (frontend + backend) en modo "native" (usa mocks y optimizaciones locales):

```bash
npm run start:native
```

- Arrancar solo el backend en modo desarrollo:

```bash
npm run dev --workspace=server
```

- Arrancar el mock-server local (USGS / Open-Meteo):

```bash
cd server
npm run mock
```

## Variables de entorno útiles

- `NATIVE_DEV_MODE` (string) — `'true'` o `'false'`. Cuando `'true'` el backend prioriza mocks locales y evita inicializaciones pesadas.
- `FORCE_MOCKS` (string) — `'true'` fuerza respuestas mock incorporadas (útil para demos y desarrollo offline). Las respuestas incluirán `isMock: true`.
- `USGS_MOCK_PORT` (número) — puerto para mock USGS (por defecto `4011`).
- `OPEN_METEO_MOCK_PORT` (número) — puerto para mock Open-Meteo (por defecto `4030`).
- `USGS_RETRY_ATTEMPTS` (número, por defecto `3`) — cantidad de intentos antes de fallback.
- `USGS_RETRY_BASE_DELAY_MS` (número, por defecto `500`) — retardo base para backoff exponencial.

## Mock server

Se incluye un mock server minimal en `server/mocks/mock-server.js` que sirve:

- `GET /usgs/significant_day.geojson` — devuelve un GeoJSON con un evento mock.
- `GET /v1/forecast` — devuelve una respuesta con `current_weather`, `hourly` y `daily` similar a Open-Meteo.

Arrancarlo con `npm run mock` desde la carpeta `server`. El puerto por defecto es `4011` y puede configurarse con `USGS_MOCK_PORT`.

## Fallbacks y comportamiento

- `SeismicIntegration` implementa reintentos con backoff exponencial (controlados por `USGS_RETRY_ATTEMPTS` y `USGS_RETRY_BASE_DELAY_MS`).
- `getSeismicActivity` en `server/src/services/usgsService.js`:
  1. Si `FORCE_MOCKS==='true'` devuelve mock embebido (rápido) con `isMock: true`.
  2. Si `NATIVE_DEV_MODE==='true'` intenta el mock local en `USGS_MOCK_PORT` y cae silenciosamente si no está disponible.
  3. Intenta la integración real con reintentos.
  4. Si todo falla, devuelve un mock de fallback y `isMock: true`.

## Tests

- Ejecutar tests del servidor:

```bash
npm --workspace=server test
```

- Ejecutar tests de frontend (jest config root):

```bash
npm test
```

Se añadieron tests rápidos para validar retry en `SeismicIntegration` y normalización de payload en `SeismicMapWidget`.

## Recomendaciones

- Considerar `axios-retry` para control de reintentos más fino.
- Crear un script `npm run mock-server` a nivel raíz si quieres arrancar todos los mocks con un solo comando.

Si quieres, puedo:
- A) Añadir tests UI (react-testing-library) para `SeismicMapWidget` y `MissionGallery`.
- B) Sustituir retry manual por `axios-retry`.
- C) Añadir una badge/indicador global en el frontend cuando cualquier endpoint devuelva `isMock: true`.

# Informe final — Live-state resiliency work

Fecha: 2025-10-10
Branch: feature/live-state-resilience

Resumen ejecutivo

Se centralizó la obtención del estado vivo (`/api/demo/live-state`) en el backend y en el frontend. Los widgets `FoodSecurityDashboard`, `EthicalVectorDisplay` y `CommunityResilienceWidget` fueron convertidos en componentes presentacionales que aceptan props exclusivamente. El backend fue endurecido para que cada sub-segmento devuelva un mock de alta fidelidad marcado con `isMock: true` si falla su integración externa, garantizando que la API NUNCA falle completamente.

Cambios principales

- Backend
  - `server/src/routes/demo.js`: per-call try/catch, mocks por segmento con `isMock:true` cuando hay fallos.
  - Tests añadidos en `server/__tests__/live-state-resilience.test.js` para verificar que la respuesta incluye todos los segmentos y marca `isMock` cuando corresponde.

- Frontend
  - `src/components/DemoSection.tsx`: orquestador único que hace la única llamada a `/api/demo/live-state` y pasa props a los hijos.
  - `src/components/FoodSecurityDashboard.tsx`, `src/components/EthicalVectorDisplay.tsx`, `src/components/CommunityResilienceWidget.tsx`: convertidos a componentes presentacionales (sin fetch/useEffect internos).
  - Test añadido: `src/components/__tests__/DemoSection.props.test.tsx` que mockea `react-simple-maps` y otros subcomponentes para validar que `DemoSection` pasa correctamente los props.

- Docs
  - `docs/LIVE_STATE_README.md`: descripción del endpoint, semántica de `isMock`, comandos para ejecutar y debugging.
  - `docs/FINAL_REPORT.md` (este archivo).

Validaciones ejecutadas

1. Suite de tests (Jest)
   - Comando: `npm test`
   - Resultado: `Test Suites: 11 passed, 11 total` / `Tests: 82 passed, 82 total`.

2. Backend en modo nativo
   - Ejecutado con: `NATIVE_DEV_MODE=true npm run start:native` (server en :4003)
   - Comprobación directa: `curl http://localhost:4003/api/demo/live-state | jq '.'` -> la respuesta contiene claves top-level y cuando las integraciones fallan, los segmentos retornan `isMock: true`.
   - Ejemplo guardado: `/tmp/demo_live_state_latest.json` (capturado durante validación).

3. Frontend dev server y proxy
   - Iniciado Vite en `VITE_PORT=3002` y `NATIVE_DEV_MODE=true` (proxy a `http://localhost:4003`).
   - Archivo HTML servido por Vite: `http://localhost:3002/` (index.html verificado).
   - Proxy verificado: `curl http://localhost:3002/api/demo/live-state | jq '.'` -> respuesta con `isMock:true` en segmentos cuando procede (capturada en `/tmp/demo_live_state_vite.json`).

Comandos clave ejecutados durante la sesión

- Tests unitarios:

```bash
npm test
```

- Levantar backend local (modo nativo):

```bash
NATIVE_DEV_MODE=true npm run start:native
# servidor debería estar en http://localhost:4003
```

- Levantar Vite dev server (frontend) para desarrollo con proxy a :4003:

```bash
env VITE_PORT=3002 NATIVE_DEV_MODE=true npm run dev
# frontend en http://localhost:3002
```

- Peticiones útiles durante debugging:

```bash
curl http://localhost:4003/api/demo/live-state | jq '.'
curl http://localhost:3002/api/demo/live-state | jq '.'
```

Estado del branch y PR

- Branch creado: `feature/live-state-resilience`
- Push hecho al remoto. Enlace sugerido para crear PR:
  https://github.com/Davicho861/etherai-foresight-platform/pull/new/feature/live-state-resilience

Siguientes pasos recomendados

1. Validación visual manual (smoke): abrir `http://localhost:3002/` en el navegador y confirmar que los widgets muestran datos y (si corresponde) badging/tooltip indicando `isMock`.
2. Añadir UI visual para `isMock` si se desea (badge en cada widget que muestre "Mock" cuando `isMock:true`). Esto mejora transparencia.
3. Preparar PR final con descripción, checklist (tests verdes, demo nativa verificada) y capturas de pantalla si se realizan.

Notas y observaciones

- Las pruebas unitarias se ejecutaron en JSDOM; algunos módulos de visualización (p.ej. `react-simple-maps`) requirieron mocks para correr en CI/local.
- El servidor reintenta integraciones externas antes de caer al mock — revisa logs del servidor para diagnosticar fallas intermitentes (Open Meteo, USGS, GDELT).

Contacto

- Para seguimiento: revisar `server/src/routes/demo.js` y `src/components/DemoSection.tsx`.

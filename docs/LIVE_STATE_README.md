# /api/demo/live-state — Live State endpoint

Resumen rápido

- Endpoint: `GET /api/demo/live-state`
- Propósito: Proveer un único paquete de datos para la UI demo (KPIs, países, resiliencia comunitaria, seguridad alimentaria, evaluación ética, global.crypto, global.seismic, etc.).
- Resiliencia: Cada sub-segmento (por ejemplo: `communityResilience`, `foodSecurity`, `ethicalAssessment`) se obtiene desde servicios internos o externas. Si una llamada falla, el servidor siempre devuelve una respuesta completa y marca el segmento como `isMock: true` (con un mock de alta fidelidad) para que la UI nunca falle.

Formato esperado (ejemplo simplificado)

```json
{
  "timestamp": "2025-10-10T21:08:02.902Z",
  "lastUpdated": "2025-10-10T21:08:02.902Z",
  "kpis": { "precisionPromedio": 90, "prediccionesDiarias": 100, "monitoreoContinuo": 24, "coberturaRegional": 6 },
  "countries": [{ "name": "Colombia", "code": "COL", "lat": 4.57, "lon": -74.29 }],
  "communityResilience": { "data": null, "isMock": true },
  "foodSecurity": { "data": [], "isMock": true },
  "ethicalAssessment": { "success": false, "isMock": true },
  "global": { "crypto": [...], "seismic": { "events": [], "summary": { "totalEvents": 0 } } }
}
```

Semántica del flag `isMock`

- `isMock: true` significa que el segmento fue servido desde un mock interno (fallback) debido a una falla en la integración de datos reales.
- `isMock: false` (o ausencia del flag) indica datos recolectados con éxito de las fuentes reales.
- La UI debe mostrar indicios visuales (badges o tooltips) cuando muestra datos mockeados para transparencia.

Cómo ejecutar localmente

1. Instalar dependencias (raíz + server workspace):

```bash
npm ci
npm run native:setup # opcional, ejecuta instalación/seed para server si es necesario
```

2. Ejecutar modo nativo (frontend + backend, server en puerto `4003` cuando `NATIVE_DEV_MODE=true`):

```bash
NATIVE_DEV_MODE=true npm run start:native
```

3. Probar manualmente el endpoint (cuando el servidor esté arriba):

```bash
curl http://localhost:4003/api/demo/live-state | jq '.'
```

Comandos de pruebas

- Ejecutar la suite completa de tests (Jest):

```bash
npm test
```

Notas de debugging

- Si ves `isMock:true` en varios segmentos, revisa los logs del servidor para identificar fallos de integración con APIs externas (Open Meteo, USGS, GDELT, etc.). El servidor intentará reintentos y finalmente entregará mocks si todo falla.
- En modo de pruebas unitarias (Jest), algunas librerías (por ejemplo `react-simple-maps`, `IntersectionObserver`) pueden necesitar mocks en JSDOM; ya hay tests en `src/components/__tests__` que incluyen estos mocks.

Contacto

- Para más detalles sobre la arquitectura, ver `server/src/routes/demo.js` y `src/components/DemoSection.tsx`.

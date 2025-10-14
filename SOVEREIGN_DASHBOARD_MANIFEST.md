# SOVEREIGN_DASHBOARD_MANIFEST

Este documento certifica la manifestación local del Dashboard Soberano.

## Resumen

- Ruta del dashboard: `/dashboard` (frontend corriendo en `http://localhost:3003/` en este entorno)
- Endpoint maestro (backend): `GET /api/demo/live-state` en `http://localhost:4003`

## Arquitectura implementada

- `src/pages/DashboardPage.tsx`: Orquestador único que realiza la llamada maestra a `/api/demo/live-state`, presenta selector de plan (`Starter`, `Growth`, `Panteón`) y pasa segmentos de `live-state` como props a los widgets.
- Widgets reutilizados: `CommunityResilienceWidget`, `FoodSecurityDashboard`, `EthicalVectorDisplay`, `TaskReplayViewer`, `MissionGallery`.

## Cómo reproducir localmente

1. Instalar dependencias (raíz + server si es necesario):

```bash
npm ci
npm run native:setup # opcional: si necesita seed/prisma
```

2. Iniciar en modo nativo (server + frontend):

```bash
npm run start:native
```

3. Verificar endpoint maestro:

```bash
curl http://localhost:4003/api/demo/live-state | jq '.'
```

4. Abrir el dashboard en el navegador:

```
http://localhost:3003/dashboard
```

## Evidencia (screenshots)

- Las capturas se colocarán en `docs/screenshots/` con los nombres:
  - `dashboard-starter.png`
  - `dashboard-growth.png`
  - `dashboard-panteon.png` (capturada como `dashboard-panten.png` en disco; renombrada a `dashboard-panteon.png`)

> Nota: Si las rutas de puerto de tu entorno cambian (Vite puede escoger 3002/3003), ajusta la URL base en el script de captura.

## Archivo de captura (puppeteer)

- `scripts/capture-dashboard-puppeteer.js` es un script de utilidad que abre el dashboard y toma las capturas en los 3 estados. No se integró Playwright por solicitud explícita.

## Declaración final

La Sombra ha sido desterrada. La Manifestación es completa. El Valor es visible.

---

Fecha de manifestación: 2025-10-12
# Capturas actuales (puerto detectado dinámicamente)
- Vite: http://localhost:3004/ (puerto real usado durante la captura)
- Capturas guardadas en: `docs/screenshots/`

### Imágenes incrustadas

![starter](docs/screenshots/dashboard-starter.png)

![growth](docs/screenshots/dashboard-growth.png)

![panteon](docs/screenshots/dashboard-panteon.png)
# SOVEREIGN_DASHBOARD_MANIFEST

Este documento certifica la manifestación local del "Dashboard Soberano".

Resumen
- Página unificada: `/dashboard` (componente `src/pages/DashboardPage.tsx`).
- Fuente de datos: `GET /api/demo/live-state` del backend nativo (puerto por defecto 4003 en NATIVE_DEV_MODE).
- Planes disponibles: Starter, Growth, Panteón (selector en el sidebar).

Arquitectura implementada
- `src/pages/DashboardPage.tsx`:
  - Realiza una única llamada a `/api/demo/live-state` y hace poll cada 15s.
  - Selector de plan en el sidebar que controla render condicional de widgets.
  - Pasa `communityResilience`, `foodSecurity`, `ethicalAssessment`, `global.seismic` como props a componentes hijos.

Cómo reproducir localmente
1. Instalar dependencias:

```bash
npm ci
npm run native:setup  # opcional
```

2. Iniciar en modo nativo (server + frontend):

```bash
NATIVE_DEV_MODE=true npm run start:native
```

3. Abrir la UI: http://localhost:3003/dashboard (Vite puede usar 3003 si 3002 está ocupado).

Validación y evidencia
- Endpoint comprobado: `curl http://localhost:4003/api/demo/live-state | jq '.'` devuelve un paquete con `kpis`, `countries`, `communityResilience`, `foodSecurity`, `ethicalAssessment`, `global`.

Screenshots
- Aquí se colocarán capturas de cada estado del dashboard después de ejecutar las pruebas headless:
  - `docs/screenshots/dashboard-starter.png`
  - `docs/screenshots/dashboard-growth.png`
  - `docs/screenshots/dashboard-panteon.png`

Proclamación final
> La Sombra ha sido desterrada. La Manifestación es completa. El Valor es visible.

Notas
- El backend devuelve `isMock: true` en segmentos cuando las integraciones externas fallan; el frontend muestra estados informativos en esos casos.
- Si necesitas que capture los screenshots ahora en este entorno, ejecutaré un test headless y los guardaré en `docs/screenshots/`.

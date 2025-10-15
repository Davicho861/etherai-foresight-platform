# GEMINI_SOUL_MANIFEST

Fecha: 14 de octubre de 2025

Resumen
-------
Este manifiesto documenta la "refundación estética" hacia la identidad Gemini aplicada al frontend del proyecto.
Se centralizaron tokens CSS, se mapearon en Tailwind y se propagaron a los primitives y dashboards de alta visibilidad. Se eliminaron gradientes fuertes y efectos de glassmorphism en favor de superficies sobrias tokenizadas.

Principales decisiones
---------------------
- Single source of truth para tokens: `src/index.css` contiene las variables CSS (por ejemplo `--card`, `--border`, `--primary`, `--text-primary`, `--text-secondary`, `--accent-yellow`, `--accent-red`).
- Tailwind está mapeado para usar esas variables: `tailwind.config.ts` (extensiones de theme) — permite utilidades como `bg-[color:var(--card)]`.
- UI primitives actualizados para usar tokens: botones, tarjetas, inputs, selects, tabs y sidebar ahora usan las variables Gemini.
- Se removieron gradientes/backdropFilter en los dashboards de alta visibilidad y se sustituyeron por superficies tokenizadas y bordes suaves.

Archivos modificados (selección relevante)
-----------------------------------------
- src/index.css                   — Declaración de variables Gemini (tokens)
- tailwind.config.ts              — Mapping de variables a theme/colors
- src/components/ui/button.tsx   — Uso de tokens para estados y fondos
- src/components/ui/card.tsx     — Surface y border tokenizados
- src/components/ui/input.tsx
- src/components/ui/textarea.tsx
- src/components/ui/select.tsx
- src/components/ui/tabs.tsx
- src/components/ui/sidebar.tsx

- src/components/dashboards/CEODashboard.tsx
- src/components/dashboards/CFODashboard.tsx
- src/components/dashboards/CTODashboard.tsx
- src/components/dashboards/CIODashboard.tsx
- src/components/dashboards/COODashboard.tsx
- src/components/dashboards/CSODashboard.tsx
- src/components/dashboards/CMODashboard.tsx  — reparado (JSX) y tokenizado

- scripts/gemini_screenshots.js   — script de captura con puppeteer

Capturas generadas
------------------
Las capturas se generaron con `scripts/gemini_screenshots.js` y están disponibles en:

- artifacts/gemini_screenshots/home.png
- artifacts/gemini_screenshots/demo.png
- artifacts/gemini_screenshots/dashboard.png
- artifacts/gemini_screenshots/sdlc-dashboard.png
- artifacts/gemini_screenshots/demo_growth.png

Verificación realizada
---------------------
- `npm run build` (vite build) — build de producción completado sin errores.
- `npm run gemini:verify` — intentó levantar backend+frontend y ejecutar el script de screenshots.
  - Observación: durante la ejecución el proceso backend detectó que el puerto `4000` estaba en uso (EADDRINUSE). Esto no impidió que el frontend se levantara en otro puerto y que las capturas se generaran correctamente apuntando a `http://localhost:3002`.

Cómo reproducir localmente
-------------------------
1) Instalar dependencias (si hace falta):

```bash
npm ci
```

2) Ejecutar verificación completa (levanta backend y frontend en paralelo y captura):

```bash
# Esto lanzará backend+frontend y luego ejecutará el script de screenshots
npm run gemini:verify
```

Si el backend no puede iniciarse en el puerto `4000` por conflicto, libera el puerto o ajusta `BACKEND_PORT`:

```bash
# Matar proceso que escucha en 4000 (ejemplo)
sudo lsof -ti:4000 | xargs -r kill -9

# O ejecutar con puerto alternativo
BACKEND_PORT=4100 VITE_PORT=3002 npm run gemini:verify
```

Notas de estilo y alcance
------------------------
- Cambios intencionales: solo se cambiaron superficies, colores y clases relacionadas con aspecto; no se modificó la lógica de negocio salvo pequeñas correcciones sintácticas (ej. `_setSelectedMetric`).
- Se evitó introducir nuevos paquetes; se reutilizó Puppeteer ya presente en `devDependencies`.

Posibles siguientes pasos (recomendados)
-------------------------------------
1. Añadir un `safelist` en `tailwind.config.ts` si la poda de Tailwind elimina clases dinámicas que se usan en runtime.
2. Ejecutar `npm run lint` y `npm test` en CI; corregir hallazgos menores si aparecen.
3. Preparar un PR con este manifiesto y las capturas, y habilitar una verificación visual (si tu CI/PR puede ejecutar `gemini:verify`).

Logs y notas técnicas breves
---------------------------
- Build Vite finalizó exitosamente (salida: "built in 3.69s") y los assets de dashboards se generaron (entre ellos `CMODashboard` y `CSODashboard`).
- El script de screenshots usó `http://localhost:3002` por defecto; en esta ejecución guardó 5 PNGs en `artifacts/gemini_screenshots/`.

Cambios pendientes/optativos
---------------------------
- Revisar dashboards menos usados (demos y widgets) para propagar tokens si lo deseas.
- Añadir tests de snapshot visual (opcional) para evitar regresiones estéticas.

Contacto técnico
----------------
Si quieres que prepare el PR (branch, commit message y abrir el PR), puedo:

 - Crear un commit con los cambios y el manifiesto.
 - Generar un branch descriptivo `aion/gemini-manifest` y abrir un PR (si me das permiso para empujar).

Fin del manifiesto.
# GEMINI_SOUL_MANIFEST

Resumen mínimo de la refundación estética "Gemini"

Fecha: 14 de octubre de 2025

Objetivo
- Unificar la identidad visual del proyecto bajo la paleta y tokens "Gemini".
- Reemplazar glassmorphism y gradientes llamativos por superficies sobrias y contrastadas.
- Centralizar colores en variables CSS definidas en `src/index.css` y mapearlas en `tailwind.config.ts`.

Ficheros clave
- Tokens globales: `src/index.css` (variables --primary, --card, --popover, --text-primary, --text-secondary, --accent-yellow, --accent-red, etc.)
- Tailwind mapping: `tailwind.config.ts` (colores mapeados a `hsl(var(--...))`)
- UI primitives actualizadas: `src/components/ui/*` (button, card, input, textarea, select, tabs, sidebar) — usan ahora variables Gemini.
- Dashboards SDLC editados: `src/components/dashboards/{Planning,Design,Implementation,Testing,Deployment}Dashboard.tsx` — gradientes/blurs removidos, charts actualizados para usar `hsl(var(--...))`.

Decisiones de diseño (concretas)
- Superficies: usar `bg-[color:var(--card)]` para tarjetas y `bg-[color:var(--popover)]` para popovers/menus.
- Bordes: `border-[color:var(--border)]` para todas las tarjetas y triggers.
- Tipografía: stack Inter + Roboto (configurado en `tailwind.config.ts` y `src/index.css`).
- Acciones y acentos: `--primary` para CTA y series principales; `--accent-yellow` y `--accent-red` para prioridades/alertas.
- Charts: Recharts ahora usa colores tipo `hsl(var(--primary))`, `hsl(var(--accent-yellow))`, `hsl(var(--accent-red))` y tooltips con `backgroundColor: 'hsl(var(--card))'` y borde `1px solid hsl(var(--border))`.

Verificaciones realizadas
- Capturas generadas (headless) y guardadas en: `artifacts/gemini_screenshots/`
  - home.png
  - demo.png
  - dashboard.png
  - sdlc-dashboard.png
  - demo_growth.png
- Build de producción: `npm run build` completado correctamente (vite build ✅). Esto indica que no hubo errores de compilación ni purga óbvia de clases usadas.

Notas y siguientes pasos recomendados
- Validación visual: revisar las capturas en `artifacts/gemini_screenshots/` y, si se desea, generar un baseline para visual regression.
- Tailwind purge: aunque la build pasó, clases arbitrarias generadas en tiempo de ejecución pueden no detectarse por el extractor (por ejemplo si se construyen strings CSS dinámicamente fuera del código fuente estático). Si detectas inconsistencias en producción, añadir una safelist en `tailwind.config.ts` como:

```js
  // ejemplo: agregar en top-level config
  // safelist: [/bg-\[color:var\(--/, /text-\[color:var\(--/]
```

- Propagación completa: ya se aplicaron cambios conservadores a los dashboards SDLC; puedo continuar con el resto de pantallas (C-suite, informes) si confirmas.

Contacto rápido
- Archivos editados en este ciclo: ver commits o diffs recientes. Para más cambios, puedo generar PRs o seguir editando localmente según prefieras.

Fin del manifiesto.
GEMINI_SOUL_MANIFEST

Fecha: 14 de octubre de 2025
Autor: Hefesto (automático)

Resumen
-------
Esta manifestación aplica la nueva identidad visual "Gemini Soul" a la aplicación Praevisio AI. Cambios realizados:

- Paleta Gemini integrada (variables CSS y tokens de Tailwind).
- Tipografía: Inter + Roboto añadida y aplicada.
- Eliminación de estilos de glassmorphism (gradientes radiales y filtros de blur) en componentes demo.
- Re-diseño sobrio y consistente del `GrowthDemoDashboard` para usar la nueva paleta: fondos planos, tarjetas limpias, acentos vibrantes.

Archivos modificados (resumen)
-----------------------------
- `src/index.css`: nuevas variables CSS para la paleta Gemini y uso de Inter/Roboto.
- `tailwind.config.ts`: añadido token `gemini` y fuente Inter/Roboto.
- `src/components/demos/GrowthDemoDashboard.tsx`: eliminado glassmorphism; tarjetas y componentes ajustados para la nueva estética.

Paleta Gemini (valores)
------------------------
- background: #0c0c0f (variable: --background)
- primary: #4f80ff (variable: --primary)
- accent-yellow: #ffab00 (variable: --accent-yellow)
- accent-red: #e53935 (variable: --accent-red)
- text-primary: #ffffff (variable: --text-primary)
- text-secondary: ~gris claro (variable: --text-secondary)

Cómo verificar rápidamente
-------------------------
1. Instalar dependencias (si es necesario):

   npm install

2. Iniciar la app en modo desarrollo:

   npm run start:native

3. Navegar a los dashboards (ej. `GrowthDemoDashboard`) y comprobar:
   - Fondos planos oscuros (no gradientes ni blur)
   - Cabecera con color primario (`--primary`)
   - Tarjetas con borde sutil y fondo `--card`
   - KPIs y gráficas con acentos en `--primary`, `--accent-yellow`, `--accent-red`

Capturas de pantalla y certificación
-----------------------------------
- Para certificar la manifestación, se recomienda ejecutar un script de Puppeteer que visite cada ruta y guarde capturas en `artifacts/gemini_screenshots/`.

Capturas generadas (ejecución automática):

- `artifacts/gemini_screenshots/home.png` — Vista raíz / landing
- `artifacts/gemini_screenshots/demo.png` — Ruta /demo
- `artifacts/gemini_screenshots/dashboard.png` — Ruta /dashboard
- `artifacts/gemini_screenshots/sdlc-dashboard.png` — Ruta /sdlc-dashboard
- `artifacts/gemini_screenshots/demo_growth.png` — Ruta /demo/growth (Growth dashboard)

Verificación rápida:

- Las imágenes se generaron con Puppeteer en este entorno y están disponibles en `artifacts/gemini_screenshots/`.
- Revisa visualmente las capturas para confirmar la eliminación de glassmorphism y la aplicación de la paleta Gemini.

Galería rápida
-------------

Abre las siguientes rutas en el repositorio para ver las capturas generadas:

- ![Home](artifacts/gemini_screenshots/home.png)
- ![Demo](artifacts/gemini_screenshots/demo.png)
- ![Dashboard](artifacts/gemini_screenshots/dashboard.png)
- ![SDLC Dashboard](artifacts/gemini_screenshots/sdlc-dashboard.png)
- ![Growth Demo](artifacts/gemini_screenshots/demo_growth.png)

Siguientes pasos propuestos
--------------------------
- Aplicar la estética a todos los dashboards (CEODashboard, PredictiveAnalysisDashboard, etc.).
- Actualizar componentes base (Buttons, Inputs, Sidebar) para usar tokens `gemini` de forma uniforme.
- Crear pruebas visuales automáticas con Puppeteer/Playwright para capturas y comparaciones.

Notas
-----
Este commit es intencionalmente conservador en lógica funcional y agresivo en estética: mantiene la estructura y funcionalidad existente mientras reemplaza la apariencia por la nueva identidad Gemini.

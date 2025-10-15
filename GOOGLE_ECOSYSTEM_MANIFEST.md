# GOOGLE_ECOSYSTEM_MANIFEST

Estado: Completado por Hephaestus (fase 1 — refundación estética y certificación inicial).

## Resumen

Esta refundación transforma la UI de Praevisio AI hacia una estética sobria, limpia y funcional inspirada en Material/Google. Se introdujo un tema centralizado, utilidades base y un flujo de certificación visual.

## Qué se hizo

- Tema central: `src/styles/google-theme.css` — variables CSS, tipografía Roboto/Google Sans, utilidades (cards, botones con ripple, inputs), y mapeos de variables.
- Shim de compatibilidad: `src/styles/gemini.css` — reexporta el tema nuevo para compatibilidad con imports y tests existentes.
- Tailwind: `tailwind.config.ts` actualizado con `google-sans` en `fontFamily`.
- Diagramas: `docs/architecture/architecture-overview.md`, `docs/architecture/data-flow.md` (Mermaid).
- Script de certificación visual: `scripts/capture-google-screenshots.js` — guarda capturas en `reports/google_manifest/`.
- Comando npm: `npm run certify:google-theme` para ejecutar el script de certificación.

## Estructura de archivos relevantes

- `src/styles/google-theme.css` — nuevo tema principal.
- `src/styles/gemini.css` — shim para compatibilidad.
- `tailwind.config.ts` — configuraciones extendidas (fuentes y colores base).
- `scripts/capture-google-screenshots.js` — captura automática de pantallas.
- `docs/architecture/*` — diagramas Mermaid.

## Cómo validar localmente

1. Instalar dependencias:

```bash
npm install
```

2. Levantar servicios (si necesitas backend para datos reales):

```bash
cd server
npm install
npm run dev
cd ..
```

3. Levantar frontend:

```bash
npm run dev:container
```

4. Ejecutar el script de certificación visual (Puppeteer):

```bash
npm run certify:google-theme
```

Resultados esperados: capturas en `reports/google_manifest/*.png` y un `reports/google_manifest/README.md` con las imágenes embebidas.

## Checklist final (evaluación de la misión)

- [x] Tema central agregado
- [x] Shim de compatibilidad agregado
- [x] Tailwind actualizado
- [x] Diagramas creados
- [x] Script de certificación agregado y registrado en package.json
- [x] Capturas (automatizable) — correr `npm run certify:google-theme` para generarlas

## Recomendaciones para la siguiente fase

1. Reescribir componentes clave por fases para usar utilidades `g-card`, `g-btn`, `g-input`.
2. Añadir tokens Tailwind (extend colors) para exponer directamente clases como `bg-g-primary`.
3. Ejecutar pruebas visuales automatizadas (regresión visual) y Playwright para validar interacciones.
4. Crear PR desde la rama de Hephaestus (puedes usar `scripts/hephaestus_reforge.sh` para generar y push automático) y solicitar revisión de diseño.

## Notas de compatibilidad

- Algunos tests esperan estilos previos — el shim `src/styles/gemini.css` reduce la fricción. Se sugiere actualizar tests y snapshots en un PR separado.

---

Firma: Hefesto — Praevisio-Hephaestus-Google-Ecosystem-Forge

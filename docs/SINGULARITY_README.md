# Protocolo de Singularidad (seguro)

Este directorio explica la herramienta de auditoría "Singularity Audit". ATENCIÓN: por diseño la herramienta NO aplica cambios automáticamente. Genera artefactos y recomendaciones que deben revisarse manualmente.

Qué hace el workflow

- Ejecuta `npm audit`, `npm run lint`, `npm test` y guarda los resultados en `artifacts/`.
- Ejecuta `tools/generate_protocolo.js` para producir `artifacts/protocolo_singularity.json` con una lista ordenada de acciones sugeridas por "Crews".
- Sube los artefactos al run de GitHub Actions para su revisión.

Cómo usarlo localmente

1. Instala dependencias: `npm ci`
2. Ejecuta manualmente (local):

```bash
mkdir -p artifacts
npm audit --json > artifacts/npm_audit.json || true
npm run lint > artifacts/lint.txt 2>&1 || true
npm test --silent > artifacts/tests.txt 2>&1 || true
node ./tools/generate_protocolo.js artifacts
```

3. Revisa `artifacts/protocolo_singularity.json` y abre un PR con las correcciones propuestas. No mergees sin revisión humana.

Política de autonomía y seguridad

- Esta herramienta está diseñada para ayudar en la auditoría y sugerencia. No ejecuta reescrituras automáticas ni merges.
- Si deseas habilitar acciones automáticas (por ejemplo crear PRs automáticos que apliquen arreglos menores), modifica el workflow y añade las autorizaciones y reviewers necesarios. Recomendamos revisar cada cambio en CI antes de mergear.

Limitaciones

- El script `generate_protocolo.js` es heurístico y produce recomendaciones básicas. Requiere intervención humana para cambios complejos.

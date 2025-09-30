# Ciclo de Vida Autónomo (Auto-Desarrollo)

Documento que describe el flujo completo desde ``npm run propose-plan`` hasta la validación final, con un diagrama de flujo en Mermaid que muestra los pasos automatizados y los puntos de control.

## Etapas clave
1. Propuesta de plan (`npm run propose-plan`)
2. Generación de artefactos (`generate:component`, `generate:test:e2e`, etc.)
3. Integración automática (commit local, branch)
4. Validación (`npm run validate`: inicia mock Ollama, docker-compose up con db, backend, frontend, seed, e2e-tester, healthchecks, Playwright tests)
5. Sincronización de Kanban y creación de issues

## Diagrama de Flujo (Mermaid)

```mermaid
flowchart TD
  A[Start: propose-plan] --> B{Plan válido?}
  B -- Sí --> C[generate:component]
  C --> D[generate:test:e2e]
  D --> E[Integración automática (apply patch + git commit)]
  E --> F[npm run validate]
  F --> G{Validación OK?}
  G -- Sí --> H[scripts/sync_kanban_to_issues.js]
  H --> I[Push branch & Crear PR]
  G -- No --> J[Reparaciones automáticas o manuales]
  J --> F

  B -- No --> K[Reformular plan / Reproponer]
  K --> A
```

## Controles y Mecanismos
- Cada paso produce artefactos versionables (componentes, tests e2e, documentación).
- El generador incluye tests mínimos (unit + e2e) para validar integración.
- `npm run validate` ahora incluye arranque completo de stack Docker (db, backend, frontend, seed, mock LLM, e2e-tester) con healthchecks, asegurando validación end-to-end realista.
- Fallos en validate detienen el flujo; correcciones manuales o automáticas pueden reiniciar el ciclo.
- Prisma seed asegura base de datos consistente para tests.

---

Archivo creado por "Omega" — descripción del ciclo autónomo y sus puntos de control.

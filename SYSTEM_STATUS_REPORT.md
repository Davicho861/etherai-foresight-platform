## SYSTEM STATUS REPORT — Praevisio AI

Fecha: 30 de septiembre de 2025

Resumen ejecutivo
------------------
Este informe ofrece una auditoría inicial del repositorio "Praevisio AI". Contiene un análisis de brechas entre la visión estratégica y la implementación actual, un inventario preliminar de deuda técnica (errores, fragilidades y riesgos) y un plan de acción corregido y priorizado para las fases II (Blindaje) y III (Auto-evolución).

Alcance de la auditoría
- Documentación estratégica: `docs/` (visión, kanban, runbook, despliegue).
- Código fuente: `src/`, `server/`, `scripts/`.
- Infra y containers: `docker-compose.yml`, `Dockerfile.frontend`, `Dockerfile.backend`, `start-local-beta.sh`.
- Tests y automatización: Playwright, Jest, scripts de sincronización.

1) Análisis de brechas (Gap Analysis)
------------------------------------

- Visión estratégica (CEO): foco en resiliencia, gobernanza, y crecimiento con I+D y operaciones. El repositorio contiene documentación estratégica y un `PROJECT_KANBAN.md` que refleja intención clara. Gap: la visión no está totalmente alineada con implementación automatizada ni con gobernanza (CI/CD, protección de ramas, auditoría continua).

- Infra reproducible: existe `docker-compose.yml` y Dockerfiles; gap: la experiencia de desarrollo local actual (`start-local-beta.sh`) no está basada en Docker Compose completo y usa puertos/expectativas distintas (puertos 8080/4000/3002 inconsistentes). Hay riesgo de fricción entre el dev local y la infraestructura reproducible.

- Calidad del código y deuda técnica: hay linters y scripts (`lint`) configurados, pero no hay evidencia de un pipeline que haga cumplir calidad antes de merge. Tests E2E y unitarios están presentes, pero cobertura y estabilidad no garantizadas. Gap: falta CI que ejecute lint/tests dentro del entorno Docker.

- Saneamiento de dependencias y seguridad: `package.json` declara muchas dependencias grandes (React, Playwright, LangChain, etc.). No hay lockfile en la raíz visible ni pipeline de auditoría de dependencias. Gap: posible vulnerabilidades sin mitigación automática.

- Gobernanza y automatización: el script `scripts/sync_kanban_to_issues.js` existe y puede sincronizar Kanban con Issues. Gap: no está automatizado en CI ni hay webhook/cron que lo ejecute regularmente.


2) Inventario preliminar de deuda técnica y fragilidades (priorizado)
-------------------------------------------------------------------

Alta prioridad (bloqueantes o riesgo operativo inmediato)
- Inconsistencias entre scripts y Docker:
  - `start-local-beta.sh` menciona puertos 4000 y 8080 y abre `http://localhost:8080/dashboard`, mientras que `docker-compose.yml` expone frontend en 3002 y backend en 4000. Riesgo: desarrolladores no reproducen entorno con Docker Compose.
  - `Dockerfile.frontend` arranca Vite en modo dev; es correcto para dev pero el `docker-compose` lo usa como único medio para levantar entornos E2E. Hay que estandarizar.
- Falta de CI que ejecute lint + unit + E2E dentro de Docker Compose.
- Ausencia de lockfile en la raíz (solo `bun.lockb` y `server/package.json`), lo que dificulta reproducibilidad de dependencias y mitigación de vulnerabilidades.

Media prioridad (calidad, mantenibilidad)
- Linter configurado pero `lint` permite advertencias (--max-warnings=7). Objetivo: 0 warnings.
- Dependencias grandes potencialmente innecesarias (p. ej. `numpy`, `pandas` declaradas en `package.json` JS — revisar si son placeholders o usados por bindings nativos).
- Dockerfiles que usan `npm ci` y `npx prisma generate` en pasos que pueden fallar sin `DATABASE_URL` configurado; mejorar manejo de variables en build/runtime.

Baja prioridad (mejoras y ampliaciones)
- Tests E2E con Playwright existen (`playwright/`), pero no hay un runner CI integrado.
- Falta de endpoints meta para auto-evolución (requisito de la fase III).


3) Evidencias recogidas (archivos clave escaneados)
- `docs/PROJECT_KANBAN.md` — tablero Kanban, manual.
- `docker-compose.yml` — servicio `db`, `backend`, `prisma-seed`, `frontend` y volúmenes. Healthy checks definidos.
- `start-local-beta.sh` — script de lanzamiento local (no usa Docker Compose; mezcla instalación local con concurrencia de dev servers).
- `Dockerfile.frontend` — arranca Vite en dev, expone 3002.
- `Dockerfile.backend` — multi-stage build; runner ejecuta `node src/index.js`.
- `scripts/sync_kanban_to_issues.js` — script de sincronización Kanban → Issues (requiere GITHUB_TOKEN). Implementación razonablemente robusta.


4) Plan de Acción Corregido y Prioridades (por Fase)
---------------------------------------------------

Fase I (Auditoría) — COMPLETADA (informe inicial)
- Entrega: `SYSTEM_STATUS_REPORT.md` (este documento).

Fase II (Corrección y Blindaje) — entregables y pasos inmediatos (ordenados):
  1) Estabilizar Docker y experiencia dev (3-4h)
     - Normalizar puertos y variables (usar .env.example + `docker-compose.override.yml` para dev).
     - Reescribir `start-local-beta.sh` para que sea un wrapper que invoque `docker-compose up --build` y espere healthchecks.
     - Actualizar `Dockerfile.frontend` para soportar build/prod y dev de forma explícita (multi-stage) y exponer la misma URL que el `docker-compose` espera.
  2) Generar y commitear lockfile reproducible (usar npm ci / npm install en CI dentro del contenedor).
  3) Crear un workflow GitHub Actions `ci.yml` que:
     - Levante `docker-compose up -d --build` (en runner), espere a healthchecks.
     - Ejecute `npm run lint` (fallar en warnings > 0), `npm test` y `npx playwright test` contra los contenedores.
     - Ejecute `node scripts/sync_kanban_to_issues.js` (opcional en un job separado, sólo si GITHUB_TOKEN disponible).
  4) Linting: aplicar reglas estrictas y corregir todos los errores/warnings (meta: 0 warnings). Añadir `pre-commit` hooks con `lint-staged` opcional.
  5) Remediación de dependencias: ejecutar `npm audit` en CI, fijar o actualizar paquetes críticos.

Fase III (Auto-evolución) — MVP entregables técnicos y cronograma (priorizados)
  1) `scripts/auto-plan.js` (MVP):
     - Archivo que puede ser ejecutado como servicio o webhook receiver. Recepción de eventos Issue (label 'autoplan') y, usando un LLM configurable (via API key en env), expone checklist y añade como comentario/subtareas al Issue.
  2) Endpoint `GET /api/meta/health-report` (MVP):
     - Implementar en `server/src/` una ruta que lance herramientas estáticas ligeras (cloc, `npx eslint --format json --quiet`, `git log --pretty=...` para churn) y devuelva JSON con métricas básicas.
  3) Generator CLI `npm run generate:module -- <ModuleName>` (MVP):
     - Script que crea `src/modules/<ModuleName>/` con skeleton de `index.ts`, `agent.ts`, `README.md` y test stub.
  4) Dashboard: añadir vista que consuma `/api/meta/health-report` y muestre métricas clave.


5) Riesgos, supuestos y recomendaciones inmediatas
-------------------------------------------------
- Supuestos: hay acceso a GITHUB_TOKEN con permisos repo para automatizaciones; el equipo acepta que Docker sea la única forma soportada de levantar entorno local.
- Riesgos: ejecutar CI que levante Docker Compose en runners de GitHub Actions puede requerir runners con recursos adecuados (memoria/tiempo). Tests E2E pesados pueden provocar timeouts; ajustar `jobs.<job>.timeout-minutes` y usar `--shm-size` según necesidad.
- Recomendaciones inmediatas:
  - Adoptar `.env.example` con variables mínimas (`DATABASE_URL`, `PRAEVISIO_BEARER_TOKEN`, `GITHUB_TOKEN` opcional).
  - Forzar lockfile en el repositorio (commitear `package-lock.json` o `pnpm-lock.yaml` según gestor elegido).
  - Implementar CI que ejecute todo dentro de Docker Compose y falle en primera señal de warnings/errores.


6) Siguientes pasos inmediatos (lo que voy a ejecutar ahora)
---------------------------------------------------------
- Marcar la tarea "Auditoría y reporte del sistema" como COMPLETADA en la lista de tareas.
- Pasar a: "Reforjar con Docker" (modificar `start-local-beta.sh` para invocar `docker-compose`, alinear puertos y pulir Dockerfiles).


Anexos: hallazgos técnicos rápidos
--------------------------------
- `scripts/sync_kanban_to_issues.js` requiere `GITHUB_REPOSITORY` o inferencia de git. Está preparado para ejecución manual o CI con token.
- `docker-compose.yml` ya contiene healthchecks y un job `prisma-seed` para migraciones/seed; esto es útil para reproducibilidad pero hay que asegurar que `DATABASE_URL` y permisos estén correctamente definidos en CI.

---
Fin del informe inicial.

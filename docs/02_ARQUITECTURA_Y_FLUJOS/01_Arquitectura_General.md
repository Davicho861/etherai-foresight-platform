# Arquitectura General — Praevisio (Capa de Contexto y Contenedores)

Este documento describe, a alto nivel, la arquitectura del sistema usando un enfoque tipo C4 (Contexto y Contenedores). Incluye diagramas Mermaid para facilitar la visualización y su inclusión en documentación estática.

## Resumen
- Frontend: SPA en React/Vite que sirve el dashboard y la interfaz multi-agente (servido con `serve` en producción o Vite dev server).
- Backend: Node.js Express que expone APIs REST y coordina agentes y orquestación.
- Base de datos: Prisma sobre Postgres (con migraciones y seed automáticos).
- LLM local: Ollama mock service para simulación de generación y razonamiento.
- Servicios Docker: prisma-seed (migraciones y seed), ollama-mock (simulación LLM), e2e-tester (Playwright en contenedor).
- E2E / Orquestador: Playwright y scripts de validación (`npm run validate`).

## Diagrama de Contexto (Mermaid)

```mermaid
flowchart TB
  subgraph Entorno
    Developer[Desarrollador]
    GitServer[(GitHub)]
  end

  subgraph Sistema[Praevisio Platform]
    FE[Frontend (React + Vite)]
    BE[Backend (Node.js/Express)]
    DB[(Prisma / Postgres)]
    LLM[Ollama Mock Service]
    Seed[Prisma Seed Service]
    E2E[E2E Tester (Playwright)]
    Orquestador[Orquestador Local]
  end

  Developer -->|push/pull| GitServer
  GitServer -->|CI/CD| Orquestador
  Developer -->|usa| FE
  FE -->|REST / WebSocket| BE
  BE -->|ORM| DB
  BE -->|consulta| LLM
  Seed -->|migraciones/seed| DB
  Orquestador -->|docker-compose| FE
  Orquestador -->|docker-compose| BE
  Orquestador -->|docker-compose| DB
  Orquestador -->|docker-compose| LLM
  Orquestador -->|docker-compose| Seed
  Orquestador -->|docker-compose| E2E
  E2E -->|tests| FE
  E2E -->|integration| BE
```

## Diagrama de Contenedores (Mermaid)

```mermaid
flowchart TB
  FE[Frontend Container] -->|HTTP| Serve[serve / Vite dev server]
  FE -->|API calls| BEContainer[Backend Container]
  BEContainer -->|DB connection| DB[(Prisma DB)]
  BEContainer -->|LLM API| LLM[Ollama Mock Service]
  BEContainer -->|EventBus| Agents[Agentes (workers)]
  Agents -->|persist| DB
  Agents -->|notify| FE
  Seed[Prisma Seed Container] -->|migraciones/seed| DB
  E2E[E2E Tester Container] -->|tests| FE
  E2E -->|tests| BEContainer
```

## Notas de Integración
- Los contenedores exponen salud via `/health` (backend: `/api/platform-status`, frontend: curl directo, ollama-mock: `/`).
- El `docker-compose.yml` define healthchecks para db (pg_isready), backend (curl /api/platform-status), frontend (curl localhost), ollama-mock (curl /), y dependencias condicionales (service_healthy).
- El prisma-seed ejecuta migraciones y seed después de db healthy, luego duerme para mantener el contenedor.
- El e2e-tester espera frontend y backend healthy, instala Playwright y ejecuta tests.
- El orquestador (`npm run validate`) inicia mock Ollama si puerto 11434 libre, luego docker-compose up, wait-for-services, espera e2e-tester exit code.

---

Archivo creado automáticamente por "Omega" — documentación base para `docs/02_ARQUITECTURA_Y_FLUJOS/`.

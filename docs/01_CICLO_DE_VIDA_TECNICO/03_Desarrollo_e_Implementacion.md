# Desarrollo e Implementación

## Guía de estilo de código
- Lenguajes principales: TypeScript/Node.js (backend), React + TypeScript (frontend).
- Formato: Prettier, ESLint con reglas compartidas.
- Commits: Mensajes convencionales (Conventional Commits).

## Entorno de desarrollo
- Node.js 18+ (usar `.nvmrc` o asdf)
- Instalar dependencias con npm o bun según proyecto (ver `package.json`).
- Base de datos local: Prisma + SQLite para dev, Postgres en staging/production.

## Flujo de trabajo Git
- GitFlow adaptado: ramas `main`, `develop`, `feature/*`, `release/*`, `hotfix/*`.
- PRs obligatorias, revisión por al menos 1 revisor.
- CI ejecuta lint, tests y build.

## Integraciones y testing
- Playwright para E2E.
- Jest para unit/integration.
- Mocks para servicios externos en `__mocks__`.

## Documentación de infra
- Dockerfiles existentes para backend y frontend.
- `docker-compose.yml` para desarrollo local.

---

*Documento generado por Praevisio-Atlas-Codify*
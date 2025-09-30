# Pruebas y Calidad

## Estrategia de testing
Adoptar la pirámide de pruebas:
- Unit tests: amplia cobertura de lógica crítica.
- Integration tests: flujos entre servicios (DB, agents, API).
- E2E tests: flujos de usuario y validación de alertas (Playwright).

## Plan de pruebas
- Cobertura mínima: 70% para módulos core.
- Tests automáticos en CI para PRs.
- Tests de regresión antes de cada release.

## QA y proceso de revisión
- Checklist de QA para despliegues a staging.
- Pruebas de performance y carga para endpoints críticos.

## Matriz de responsabilidad
- Devs: tests unitarios y corrección de bugs.
- QA: definición de escenarios E2E y ejecución.
- SRE/DevOps: tests de infra y despliegue.

---

*Documento generado por Praevisio-Atlas-Codify*
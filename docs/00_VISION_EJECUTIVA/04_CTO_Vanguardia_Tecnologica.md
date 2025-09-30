# CTO - Estrategia Tecnológica y Stack

## Resumen del stack
- Agentes y orquestación: implementación propia basada en `crewAI` y arquitectura de agentes.
- Integraciones LLM/IA: LangChain (o equivalente), wrappers a modelos de LLM privados y públicos.
- Testing y E2E: Playwright.
- Infraestructura: contenedores (Docker), Kubernetes para producción futura, CI/CD basado en GitHub Actions o similar.

## Principios técnicos
- Modularidad: componentes desacoplados (ingesta, modelado, orquestación, UI).
- Observabilidad: métricas, trazas y logs centralizados.
- Seguridad por diseño: control de acceso, cifrado, auditoría.
- Reproducibilidad: infraestructuras y experimentos versionados.

## Hoja de ruta tecnológica (12 meses)
1. Estabilizar motor de agentes y añadir cobertura de tests (unit + integration).
2. Preparar pipeline de CI/CD con despliegue automatizado a staging.
3. Migración a infra Kubernetes y optimización de costes.
4. Investigación y POC de modelos híbridos y caching de embeddings.

## Tecnologías clave a formalizar
- crewAI (núcleo de agentes)
- LangChain o equivalente
- Prisma (base de datos), Node.js backend, React + Vite frontend
- Playwright, Jest para testing

---

*Documento generado por Praevisio-Atlas-Codify*
Praevisio AI opera en un paradigma de desarrollo 100% nativo. Las pruebas `E2E` (Playwright) han sido purgadas para maximizar la velocidad y la agilidad.

El único comando para iniciar el universo es: `npm run start:native`.

La única validación requerida durante el desarrollo es la de pruebas unitarias: `npm test`.

### III. Prohibición de Pruebas E2E en el Dominio Local

**Queda terminantemente prohibida la reintroducción o ejecución de frameworks de pruebas End-to-End (E2E), como Playwright, en el entorno de desarrollo local.**

- **Razón:** Las pruebas E2E introducen una complejidad de entorno (navegadores, `drivers`, `timeouts`) que viola el principio de Agilidad Pura. Son lentas, frágiles y un obstáculo para el ciclo de "codificar -> ver" instantáneo.
- **La Única Arena para E2E:** La validación E2E es un arma de conquista, no una herramienta de taller. Su único y exclusivo dominio de ejecución es el **pipeline de CI/CD en la nube** (ej. GitHub Actions), donde se puede ejecutar contra un entorno de `staging` o producción real, garantizando una validación significativa.
- **Validación Local:** La única forma de validación en `localhost` es y será siempre la suite de pruebas unitarias (`npm test`).
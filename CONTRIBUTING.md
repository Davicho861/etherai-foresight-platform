# Contributing to Praevisio AI

Gracias por contribuir. Sigue estos pasos para que tu contribución sea aceptada rápidamente:

1. Fork del repositorio (si no eres colaborador directo).
2. Trabaja en una rama `feature/<descripcion>` o `bugfix/<descripcion>`.
3. Mantén commits claros y atómicos (usar Conventional Commits).
4. Ejecuta localmente:

```bash
npm ci
npm run lint
npm test
```

## Desarrollo Blindado Autónomo

Para añadir nuevas funcionalidades de forma segura y automática, usa el comando `develop:auto`:

```bash
npm run develop:auto -- "Descripción de la nueva funcionalidad"
```

Este comando orquestará automáticamente:
- Planificación de la característica
- Generación del componente de UI
- Creación de pruebas E2E
- Validación completa del sistema

Es el método preferido para añadir nuevas funcionalidades, asegurando que cada cambio esté blindado con pruebas automáticas.

## Ecosistema de Desarrollo Vivo (Praevisio-Phoenix-Live-Ecosystem)

Hemos introducido un nuevo flujo de desarrollo pensado para máxima fluidez e inteligencia predictiva.

1. Levantar el entorno vivo (hot-reloading):

```bash
npm ci
npm run dev:live
```

Esto arranca tanto el frontend (Vite) como el backend (nodemon) dentro de contenedores Docker en modo desarrollo. Los volúmenes están montados para que cualquier cambio en tu máquina se refleje automáticamente en los servicios: guardar un archivo `.tsx` o `.ts` debería mostrar el cambio casi instantáneamente.

2. Blindaje predictivo en pre-push

Antes de cada push, el hook `pre-push` ejecuta un "Guardián Predictivo" que decide inteligentemente qué pruebas E2E ejecutar. Flujo resumido:

- El script `scripts/run-smart-tests.js` recoge los archivos cambiados desde `origin/main...HEAD`.
- Envía la lista al endpoint backend `POST /api/llm/predict-tests`.
- El backend usa el LLM local configurado en el proyecto para devolver únicamente las pruebas E2E relevantes.
- Sólo esas pruebas se ejecutan (Playwright), acelerando el proceso de validación sin sacrificar cobertura en las áreas afectadas.

Si por alguna razón el guardián no devuelve recomendaciones válidas, el hook ejecutará la suite completa como fallback.

3. Flujo recomendado

- Levanta el entorno con `npm run dev:live` una vez.
- Desarrolla y verifica localmente (hot-reload + logs del backend).
- `git add` / `git commit` como de costumbre (pre-commit y otras protecciones siguen aplicando).
- `git push` — el pre-push ejecutará el Guardián Predictivo y sólo correrá los tests relevantes.

Notas:
- Puedes forzar la ejecución completa de tests ejecutando `npx playwright test` manualmente.
- El endpoint del Guardián asume que el backend está disponible en `http://localhost:4000` (puedes cambiar la variable de entorno `PRAEVISIO_BACKEND`).


5. Abre un Pull Request desde tu rama a `main` y usa la plantilla de PR.
6. Relaciona el PR con un Issue (crear issue si aplica).
7. Espera revisión y responder comentarios.

Guías adicionales:
- Añade pruebas para cambios lógicos.
- Documenta cambios relevantes en `docs/`.
- Si introduces dependencias, justifica su inclusión y asegúrate que tienen licencia compatible.

Referencias:
- `docs/README.md` (Índice de documentación)
- `docs/01_CICLO_DE_VIDA_TECNICO/*` (Políticas técnicas)

Gracias — el equipo de Praevisio AI
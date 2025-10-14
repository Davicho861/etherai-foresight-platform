# Migración de PROJECT_KANBAN.md a DB

Este documento explica cómo convertir `docs/PROJECT_KANBAN.md` a `data/kanban.json` y opcionalmente importar las tareas al backend.

Pasos:

1. Generar JSON a partir de Markdown:

```bash
npm run generate:kanban
```

Esto crea `data/kanban.json` con estructura:

```json
{
  "columns": [
    { "name": "PLANNING", "tasks": [ { "title": "...", "link": "..." } ] },
    ...
  ]
}
```

2. (Opcional) Importar tareas al backend:

Asegúrate de que el backend esté corriendo en `http://localhost:4000` (o exporta `API_BASE` con otra URL).

```bash
npm run import:kanban
# o con base distinta
API_BASE=http://localhost:4000 npm run import:kanban
```

El script hará POST a `/api/kanban/tasks` para cada tarea con los campos: `title`, `description`, `status`, `priority`, `metadata`.

Notas:
- El parser es heurístico y busca la primera tabla Markdown que exponga columnas (PLANNING, DESIGN, IMPLEMENTATION, TESTING, DEPLOYMENT).
- Revisa `data/kanban.json` y edítalo manualmente si quieres ajustar títulos o añadir campos antes de importarlo.
- Si prefieres usar Prisma directamente, existe la carpeta `server` con la configuración de Prisma; se puede crear un script que ejecute upserts usando `server/prisma`.


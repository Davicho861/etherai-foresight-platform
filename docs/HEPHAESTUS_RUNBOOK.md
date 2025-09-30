Hephaestus Reforge - Runbook

Objetivo
-------
Este runbook documenta los pasos automáticos y manuales para ejecutar la "Reforja y Saneamiento Total" del repositorio.

Precondiciones
--------------
- Clona el repositorio en tu máquina con acceso a internet y con git remoto configurado.
- Node.js v18+ y npm instalados.
- Una cuenta de GitHub con permisos para crear ramas y PRs en el repo.
- (Opcional) Un token `GITHUB_TOKEN` con scopes `repo` para activar la sincronización Kanban.

Pasos automáticos
-----------------
1. Haz ejecutable el script y ejecútalo:

```bash
chmod +x scripts/hephaestus_reforge.sh
./scripts/hephaestus_reforge.sh
```

El script hará:
- Crear una rama `hephaestus/reforge-<timestamp>`.
- Eliminar (hacer backup) y regenerar `package-lock.json` con `npm install --legacy-peer-deps`.
- Ejecutar `npm audit fix` y `npm audit fix --force`.
- Ejecutar `npm run lint -- --fix` y listar errores restantes.
- Ejecutar `npm test` y (si está disponible) `npx playwright test`.
- Si existe `GITHUB_TOKEN` exportado, ejecutará `node scripts/sync_kanban_to_issues.js`.
- Commit y push de los cambios a la rama remota.

Pasos manuales recomendados
---------------------------
- Revisa el archivo `.hephaestus_reforge.log` tras la ejecución para ver detalles.
- Si quedan errores de lint o tests fallidos, corrígelos manualmente. El script intenta arreglar lo que pueda.
- Para problemas de vulnerabilidades persistentes, inspecciona `npm audit` y considera actualizar dependencias mayores (e.g., `langchain`, `openai`) o solicitar parches upstream.

Crear el PR
-----------
Si el script realizó commits y push, abre un Pull Request desde la rama creada hacia `main` con título:

"Hephaestus: Reforja y Saneamiento Total del Repositorio"

Incluye en la descripción:
- Lista de dependencias actualizadas.
- Resultado de `npm audit`.
- Estado de lint y tests locales (adjunta `.hephaestus_reforge.log`).

Notas de seguridad
------------------
- No subas tokens o secretos en claro. Usa `GITHUB_TOKEN` en tu entorno de shell solo temporalmente.

Contacto
--------
Para ayuda, responde en el issue #infra con etiqueta `infra`.

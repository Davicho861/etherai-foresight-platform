Aion Automation - Configuración
===============================

Este documento describe cómo funciona la automatización de Aion y cómo habilitarla de forma segura.

Overview
--------
La GitHub Action `Aion Evolution Simulation` ejecuta el script `scripts/aion_simulate.py` en modo CI (variable `AION_CI_MODE=1`). En este modo el script solo genera `EVOLUTION_REPORT.md` y no realiza operaciones `git` locales que puedan alterar el repositorio.

Flujo recomendado para PRs automáticos
-------------------------------------
1. Habilitar la Action (workflow_dispatch o schedule).
2. Para crear PRs automáticos desde CI, la Action usa `peter-evans/create-pull-request`. Esto requiere el token `GITHUB_TOKEN` (provisto automáticamente). Si quieres que un bot externo abra PRs remotos con más permisos (merge automático), configura un secret `AION_BOT_TOKEN` con scope limitado.

Seguridad
---------
- Mantén el scope del token lo más reducido posible.
- Añade reglas de protección de rama en `main` para requerir revisiones humanas si lo deseas.
- Revisa y audita los cambios generados por la Action en un repositorio de staging antes de permitir merges automáticos.

Ejecución local
---------------
Para probar localmente la generación del informe sin tocar git remoto/branch:

```bash
export AION_CI_MODE=1
python3 scripts/aion_simulate.py
```

Si quieres que el script realice operaciones git locales (crear branch y merge), ejecuta sin la variable `AION_CI_MODE`.

Abrir un Pull Request remoto (opcional)
--------------------------------------
Hay un script auxiliar `scripts/aion_open_pr.py` que ayuda a empujar la rama y crear un PR remoto usando el token de GitHub.

Uso seguro (recomendado):

1. Asegúrate de generar el `EVOLUTION_REPORT.md` primero (localmente o en CI).
2. Exporta variables de entorno:

```bash
export GITHUB_TOKEN="ghp_..."         # token con scope repo (preferiblemente scoped to staging)
export GITHUB_REPOSITORY="owner/repo" # ejemplo: Davicho861/etherai-foresight-platform
```

3. Ejecuta el script (esto hará push de una rama y mostrará el curl para crear el PR):

```bash
python3 scripts/aion_open_pr.py
```

Precauciones:
- Mantén el token con el mínimo scope necesario.
- Usa un repositorio de staging para pruebas automáticas si quieres permitir merges automáticos.
- Revisa siempre el PR generado antes de hacer merge.

Opciones avanzadas del script `scripts/aion_open_pr.py`
---------------------------------------------------
El script soporta parámetros adicionales:

- `--labels "label1,label2"` — Añade etiquetas al PR (comando para añadir etiquetas mostrado tras la creación del PR).
- `--reviewers "user1,user2"` — Solicita revisores para el PR (comando mostrado tras la creación del PR).
- `--auto-merge` — Muestra el comando para auto-mergear el PR (requiere permisos de merge).

Ejemplo (dry-run):

```bash
python3 scripts/aion_open_pr.py --dry-run --labels "automated,aion" --reviewers "alice,bob"
```

Ejemplo (real, con token):

```bash
export GITHUB_TOKEN="ghp_..."
export GITHUB_REPOSITORY="Davicho861/etherai-foresight-platform"
python3 scripts/aion_open_pr.py --auto-pr --labels "automated,aion" --reviewers "alice,bob"
```

Recuerda reemplazar `{PR_NUMBER}` en los comandos mostrados por el número real del PR que devuelve la API.


Próximos pasos
--------------
- Extender el script para que el "Cronista" busque soluciones en repositorios locales o en docs internas.
- Añadir un job de validación que corra tests y linters antes de abrir el PR (implementado en el workflow `aion-evolution.yml`).
- Integrar gates de gobernanza (etiquetas, revisores automáticos) en el flujo de PR.

Cómo ajustar las condiciones para crear PRs
-----------------------------------------
El workflow crea un PR solo cuando se dispara manualmente (`workflow_dispatch`) y cuando los jobs previos han tenido éxito (lint + tests). Puedes cambiar esto:

- Para crear PRs automáticos en cada ejecución programada, ajusta la condición `if` del paso `Create Pull Request` eliminando la comprobación `github.event_name == 'workflow_dispatch'`.
- Para exigir aprobaciones humanas antes del merge, configura las reglas de protección de rama en GitHub.


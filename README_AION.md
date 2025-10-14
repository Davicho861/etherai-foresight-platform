Aion - Praevisio-Aion-Immortal-Evolution

WARNING: Estos scripts automatizan acciones en el repo local. Úsalos con cuidado.

Archivos principales:

- scripts/aion_cycle.sh  - Runner principal (ya existe). Genera reportes y crea branches en modo no-destrcutivo por defecto.
- scripts/health-check-wrapper.sh - Wrapper que localiza y ejecuta el health-check del repo.
- scripts/generate_report.py - Genera `IMMORTAL_EVOLUTION_REPORT_<timestamp>.md` desde plantilla.
- IMMORTAL_EVOLUTION_REPORT_TEMPLATE.md - Plantilla para el reporte.

Ejemplo de uso:

# Modo dry-run (no crea commits)
./scripts/aion_cycle.sh

# Ejecutar acciones Git (crear branch y commit local)
./scripts/aion_cycle.sh --no-dry-run

Recomendaciones:
- Revisa `scripts/health-check.sh` y `validate-deploy.sh` antes de ejecutar en modo no-dry-run.
- No habilites push automático sin pasar por revisiones humanas.

Helper seguro para commits/PRs
--------------------------------
Se añadió el helper `scripts/aion_commit_and_pr.sh` que facilita crear una rama `aion/evolution-<timestamp>`
con el último `IMMORTAL_EVOLUTION_REPORT_*.md`, commitearlo y opcionalmente hacer push y crear un PR.

Uso (dry-run por defecto):

```
./scripts/aion_commit_and_pr.sh
```

Opciones:
- `--no-dry-run` : ejecutar acciones Git reales (crear branch y commit)
- `--push`       : empujar la rama a `origin` (solo si `--no-dry-run`)
- `--pr`         : crear PR usando `gh` CLI (debe estar autenticado; solo si `--no-dry-run`)
- `--force`      : fuerza acciones adicionales (no recomendado)

Seguridad:
- Por defecto todo es dry-run. Revisa los comandos simulados y ejecuta con `--no-dry-run` solo cuando estés listo.
- No automatices push/PRs sin revisión humana.

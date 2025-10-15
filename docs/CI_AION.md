# CI: Aion Sovereign Cycle

Este documento resume cómo funciona el workflow `Aion Sovereign Cycle` y qué necesita el repositorio para operar autónomamente.

## Objetivo
El workflow ejecuta `scripts/aion_cycle.sh --no-dry-run` en un runner en la nube, empuja la rama generada, crea un Pull Request y lo fusiona automáticamente.

## Requisitos previos
- Añadir un secret en el repositorio llamado `GH_TOKEN` con permisos para: `repo` (contenido), `pull_requests`, y escritura en el repositorio.
  - Recomiendo crear un token de máquina (bot) y limitar sus permisos a lo mínimo necesario.
- Asegúrate de que no existan reglas de *branch protection* en `main` que impidan merges automáticos sin revisiones o comprobaciones adicionales.

## Pasos para habilitar
1. En GitHub: Settings → Secrets and variables → Actions → New repository secret
   - Name: `GH_TOKEN`
   - Value: (tu token)
2. Desde tu entorno local:

```bash
git add .github/workflows/aion_cycle.yml
git commit -m "chore(ci): add Aion Sovereign Cycle workflow"
git push origin main
```

3. Ir a Actions → "Aion Sovereign Cycle" → Run workflow → elegir branch `main` y ejecutar.

## Comportamiento del workflow
- Ejecuta `scripts/aion_cycle.sh --no-dry-run` que:
  - Genera `EVOLUTION_REPORT_<ts>.md`.
  - Ejecuta `health-check-wrapper.sh` antes de crear commits (si está presente).
  - Crea una rama `aion/evolution-<ts>` y realiza un commit con el reporte.
- El workflow empuja la rama al remoto (usando `GH_TOKEN`).
- El workflow crea un Pull Request por REST API y lo mergea con `merge_method: merge`.

## Fallos y cómo mitigarlos
- Si falta `GH_TOKEN` el workflow fallará en el paso de push o creación de PR.
- Si `health-check-wrapper.sh` falla, `aion_cycle.sh` abortará para proteger el repo.
- Si la organización exige revisiones, el merge automático fallará; en ese caso, ajusta políticas o cambia el workflow para sólo crear el PR.

## Seguridad
- Trata `GH_TOKEN` como secreto crítico.
- Considera usar un GitHub App o token con permisos limitados.
- Revisa logs de Actions regularmente para detectar actividad inesperada.

## Alternativas
- Usar `peter-evans/create-pull-request` para flujos basados en acciones (no necesario si prefieres REST).
- Usar `GITHUB_TOKEN` (token automático de Actions) si sus permisos son suficientes; nota: `GITHUB_TOKEN` puede tener restricciones para merges según políticas organizacionales.

---
Generado automáticamente como parte de la operación de ascensión del Ciclo Aion.

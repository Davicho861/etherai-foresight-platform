# SETUP_REPO - Activación de políticas y protección de ramas

Este documento describe los pasos que debe ejecutar un administrador del repositorio para activar las políticas que hacen de Praevisio AI un proyecto gobernado.

## 1. Protección de la rama `main`
- Ir a Settings → Branches → Add rule.
- Pattern: `main`.
- Activar las siguientes opciones:
  - Require pull request reviews before merging (al menos 1 approver)
  - Require status checks to pass before merging (seleccionar los checks del workflow: `lint_and_test_unit`, `e2e`/`run-unit-tests` según el nombre en tu CI)
  - Include administrators (para evitar merge directo por admins sin pasar checks)

## 2. Requerir checks específicos
- En la sección "Require status checks to pass before merging" añade los jobs del workflow de GitHub Actions:
  - `install-dependencies` (si aplica)
  - `lint-and-format` o `lint_and_test_unit` dependiendo del workflow
  - `run-unit-tests`
  - `run-e2e-tests` (opcional)

## 3. Reglas adicionales recomendadas
- Require signed commits (si se desea mayor seguridad).
- Enforce linear history (opcional).

## 4. Tokens y secretos
- Añadir secretos en Settings → Secrets and variables → Actions:
  - `PRAEVISIO_BEARER_TOKEN` (si los tests E2E lo requieren)
  - `GITHUB_TOKEN` se crea automáticamente para Actions; para scripts externos añade un token con permisos `repo` llamado `ACTIONS_SYNC_TOKEN` (si se usará `scripts/sync_kanban_to_issues.js`).

## 5. Labels y Automation
- Crear labels base (backend, frontend, data, devops, security, docs, qa, priority:high, priority:medium)
- Opcional: crear GitHub Actions para la auto-rotulación de Issues basada en contenido.

---

*Instrucciones generadas por Praevisio-Aegis-Activate*
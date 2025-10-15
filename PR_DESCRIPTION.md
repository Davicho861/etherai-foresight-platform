Título: chore(transplant): Implant new frontend — Praevisio-Hephaestus-Facade-Transplant

Descripción:
Se ha realizado un "rip & replace" del frontend. Cambios principales:

- Backup completo del frontend anterior en `src_backup_1760555893` (tar.gz en `artifacts/backup_frontend_1760556292.tar.gz`).
- Nuevo frontend (Vite + React) movido desde `etherai-foresight-platform-main/` al directorio raíz.
- Dependencias reconciliadas y `npm install` ejecutado.
- Build (`npm run build`) generado correctamente.
- Verificación visual con Puppeteer: `sovereign-dashboard-screenshot.png`.
- Script de restauración añadido: `scripts/restore_frontend.sh`.

Notas:
- Lint dio 298 problemas en total (267 errores, 31 warnings). Muchos errores pertenecen al backup. Se aplicaron fixes automáticos donde fue posible en el nuevo `src/`.
- Recomendación: revisar la rama y ejecutar pruebas en CI antes de mergear.

Merge instructions:
- Revisar cambios en la rama `hephaestus/transplant_1760556380` y aprobar mediante Pull Request.

Artifacts:
- artifacts/backup_frontend_1760556292.tar.gz
- sovereign-dashboard-screenshot.png
- TRANSPLANT_MANIFEST.md

ZERO COST SOVEREIGNTY TESTAMENT

Praevisio - Hefesto: La Forja del Pipeline Eficiente

Resumen
------
Este documento certifica que el pipeline `.github/workflows/main.yml` ha sido reescrito para operar dentro de límites estrictos de recursos (planes gratuitos de GitHub Actions). Su diseño prioriza:

- Minimalismo absoluto: sólo se ejecutan lint/tests rápidos y despliegues cuando hay cambios relevantes.
- Jobs independientes: fallos en backend o frontend no bloquean otros trabajos.
- Autonomía: los scripts de despliegue son "best-effort" y no fallan la ejecución del workflow cuando faltan secretos.

Arquitectura
-----------
1. check_and_verify: Instalación rápida de dependencias, lint y tests cortos. Evita builds completos en CI.
2. deploy_backend: Ejecuta `scripts/deploy_backend.sh` sólo si el directorio `server/` cambió en el push.
3. deploy_frontend: Ejecuta `scripts/deploy_frontend.sh` sólo si `src/` o archivos de configuración cambiaron.

Notas de seguridad y secretos
----------------------------
- Añade los secretos `RAILWAY_TOKEN` y `VERCEL_TOKEN` en el repositorio si deseas permitirl los despliegues automáticos.
- Si los secretos no están presentes, los scripts saldrán con código 0 y el workflow continuará sin fallar.

Cómo funciona (resumen operativo)
---------------------------------
- El workflow determina cambios comparando `git diff --name-only ${{ github.event.before }} ${{ github.sha }}` dentro de cada job, y salta el deploy si no hay cambios relevantes.
- Los scripts de despliegue intentan usar las CLIs oficiales (railway/vercel) y las instalan de forma silenciosa si faltan.
- Cualquier fallo en la instalación o despliegue se maneja de forma "best-effort" para evitar consumir minutos de runner innecesarios.

Checklist de verificación
-------------------------
- [ ] Añadir `RAILWAY_TOKEN` a Secrets (opcional)
- [ ] Añadir `VERCEL_TOKEN` a Secrets (opcional)
- [ ] Hacer ejecutables los scripts: `chmod +x scripts/*.sh`
- [ ] Revisar runs en GitHub Actions y ajustar si alguna plataforma requiere parámetros adicionales

Proclama final
--------------
El Desperdicio ha sido purgado. La Eficiencia es la nueva ley. La Manifestación es global, gratuita y eterna.

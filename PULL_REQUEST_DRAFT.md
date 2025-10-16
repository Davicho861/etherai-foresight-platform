# Draft PR: Purge legacy frontend and integrate new landing

Resumen:

- Esta PR elimina el frontend legacy (Vite) y sustituye la landing por un build estático integrado en `landing/dist/`.
- Añade `Dockerfile.frontend` y `nginx.conf` para servir la landing con Nginx y actualiza `docker-compose.yml` para incluir el servicio `landing` en el puerto 3003.
- Incluye scripts de apoyo: `scripts/purge_old_frontend.sh`, `scripts/purge_docker.sh`, `scripts/rollback_frontend.sh`.

Checklist:

- [x] Purga del frontend legacy realizada y commiteada.
- [x] Nuevo landing extraído a `landing/dist/`.
- [x] `Dockerfile.frontend` y `nginx.conf` añadidos.
- [x] `docker-compose.yml` actualizado.
- [x] Despliegue mínimo realizado y verificado con Puppeteer.
- [ ] Revisar política de CI y ver que la build frontend no choque con pipelines existentes.

Rollback plan:

1. Ejecutar `scripts/rollback_frontend.sh` desde la rama principal limpia.
2. Revisar la rama creada y realizar merge si se desea restaurar el frontend.
3. Alternativamente, usar `git revert <commit>` del commit de purga.

Notas de despliegue:

- El nuevo landing sirve en `http://localhost:3003/` cuando se usa `docker-compose up -d`.
- Para pruebas rápidas sin Docker: `npx serve landing/dist -l 3003`.

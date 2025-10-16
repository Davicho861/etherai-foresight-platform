# NEW ORDER MANIFEST

Resumen de la purga y certificación del nuevo frontend (Praevisio-Ares)

Fecha: TODO: insertar fecha

Acciones realizadas / recomendadas:

- Rama de respaldo: `backup/purge-YYYYMMDDT-HHMMSS` (crear antes de borrar)
- Archivar frontend(s) antiguos en `.archives/praevisio_ares_<timestamp>`
- Limpiar Docker selectivamente (ver `scripts/praevisio_ares_purge.sh`)
- Desplegar nuevo frontend: `npm run dev:sovereign` (esperar a que escuche en 3002)
- Capturar y adjuntar screenshot con `scripts/praevisio_capture_and_certify.cjs`

Screenshot de la nueva gloria:

![new order screenshot](reports/praevisio/new_order_screenshot.png)

Notas de verificación:

- URL comprobada: http://localhost:3002/
- Botón "App" probado: TODO: resultado
- Dashboard accesible en: http://localhost:3002/dashboard

Commit de cierre: `docs: certify new order and archive old frontends`

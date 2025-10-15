Praevisio Atlas - Manifest script
=================================

Uso rápido
---------

Desde la raíz del repo:

1. Asegúrate de tener Docker y docker-compose instalados.
2. Asegúrate de tener Node.js y npm instalados.
3. Ejecuta:

```bash
npm run manifest
```

Qué hace
---------

- Levanta los servicios `db` (Postgres) y `neo4j` definidos en `docker-compose.yml`.
- Exporta variables de entorno para que el backend/frontend nativos apunten a los servicios Docker mapeados en localhost.
- Inicia el backend en modo desarrollo (`npm --prefix server run dev`) y el frontend (`npm run dev:container`).
- Espera a que los endpoints respondan y abre varias pestañas en tu navegador apuntando a los dashboards clave.

Advertencias y precondiciones
-----------------------------

- El script asume que los puertos locales 5433 (Postgres), 7687/7474 (Neo4j), 4000 (backend) y 3002 (frontend) están disponibles.
- No elimina datos existentes de las bases de datos.
- Si el backend o frontend requieren variables de entorno adicionales, configúralas antes de ejecutar el script o modifica `scripts/manifest-empire.sh`.

Detener
------

- Para detener los servicios Docker:

```bash
docker-compose down --volumes --remove-orphans
```

- Para detener los procesos nativos iniciados por el script (si aún corren):

```bash
kill <PID_BACKEND> <PID_FRONTEND>
```

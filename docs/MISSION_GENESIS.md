Reproducción local de la "Misión Génesis" (Tyche)

Resumen rápido
--------------
Este documento explica cómo reproducir localmente la "Misión Génesis" que crea e integra el agente Tyche, el cual detecta tests "flaky" y propone correcciones. La ejecución es totalmente local y de "mejor esfuerzo" (best-effort): persiste logs en ChromaDB/Neo4j si están disponibles y crea un PR simulado en `tmp/tyche`.

Pasos mínimos
-------------
1. Levantar servicios dependientes (opcional, pero recomendado):
   - Levanta la pila con docker-compose para disponer de `chromadb` y `neo4j`:

     docker-compose up -d --build

   - Verifica salud de servicios (opcional):

     docker-compose ps

2. Iniciar el servidor (desde el workspace raíz):

   # si no hay otro proceso en 4000
   npm --prefix server run dev

   # o arrancar en un puerto alternativo
   PORT=4001 node server/src/index.js

3. Iniciar la Misión Génesis (Tyche):
   - Desde la UI: abre `http://localhost:3002/demo` (si el frontend corre) y pulsa "Iniciar Misión Génesis (Tyche)".
   - Por API (rápido):

     curl -X POST http://localhost:4000/api/agent/start-tyche-mission -H "Content-Type: application/json"

     (Si arrancaste en 4001, usa ese puerto.)

   - Esto devolverá un JSON con `missionId`.

4. Ver logs en streaming (SSE):

   curl -N http://localhost:4000/api/agent/mission/<missionId>/stream

5. Ver PR simulado:

   - Al finalizar, el agente Tyche (si detecta problemas) escribe un archivo de PR simulado en `tmp/tyche/`.
   - Revisa `tmp/tyche/` para ver el contenido:

     ls -la tmp/tyche
     cat tmp/tyche/tyche_pr_*.txt

Notas técnicas
---------------
- El backend usa un cliente Chroma REST best-effort y un driver Neo4j; ambos son tolerantes a fallos locales (fallbacks en memoria, y no bloquearán la ejecución si no están disponibles).
- El agente `Tyche` está implementado en `server/src/agents.js` y se activa específicamente cuando el contrato de misión tiene `id: 'genesis-tyche'`.
- La lógica de orquestación está en `server/src/orchestrator.js`.

Siguientes pasos recomendados
----------------------------
- Integrar un cliente Chroma oficial (si se desea mayor durabilidad).
- Añadir validaciones y pruebas E2E que ejecuten la misión completa a través del frontend y verifiquen el archivo en `tmp/tyche`.
- Automatizar la generación y mezcla de un PR real en un repositorio local (por ejemplo usando `git` y ramas temporales) con pruebas y checks.

Contacto
--------
Para ayuda adicional, revisa `docs/PRAEVISIO_PRECOGNITIVE_SYSTEM.md` y `docs/PRAEVISIO_AION_PROMPT.md`.

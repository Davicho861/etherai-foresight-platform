# RUNBOOK DE ERRORES COMUNES

| Error | Causa | Solución |
|-------|-------|----------|
| `npm ci` (ENOTEMPTY, tarball corrupted) | Conflicto de volúmenes | `user: "${HOST_UID}:${HOST_GID}"` y volúmenes nombrados |
| E2E `ERR_CONNECTION_REFUSED` | Orquestación, puertos | Orquestador atómico `npm run validate` con `docker-compose` |
| `llm is not defined` | Falta `OPENAI_API_KEY` | Fallback a LLM local (Ollama) |
| Error de sintaxis en tests generados | Mocks básicos | Reforzar el endpoint del LLM para generar código válido |
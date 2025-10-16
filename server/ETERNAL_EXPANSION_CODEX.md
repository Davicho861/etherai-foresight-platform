# ETERNAL EXPANSION CODEX

Resumen de Ares-IV cambios y comandos principales.

Entregables:
- monitoring/prometheus.yml: configuración de scrapes y regla básica de cobertura
- monitoring/index.js: servidor /metrics usando prom-client
- auto-heal.js: cron/one-shot para ejecutar tests y aplicar audit fixes heurísticos
- eternal_loop.js: loop perpetuo que ejecuta ares3_loop, tests, metrics update y simula docker/git
- Dockerfile.multi: hints multi-arch
- .github/workflows/multi-deploy.yml: stub workflow para buildx

Comandos útiles:
- Ejecutar metrics: npm run start:metrics
- Ejecutar auto-heal una vez: npm run heal
- Ejecutar loop eterno (local, puede requerir env): npm run eternal

Notas de seguridad y comportamiento:
- git push en `eternal_loop.js` es seguro: si no hay remote o credenciales falla de forma no destructiva.
- Docker buildx se simula en entorno sin daemon o credenciales.

Monitoring example embed (prometheus.yml):

```yaml
scrape_configs:
  - job_name: 'etherai_server'
    metrics_path: /metrics
    static_configs:
      - targets: ['localhost:3000']
```

Perf goal: oleadas y ciclos <10s depende del entorno; en local esto es un objetivo aspiracional.

Instrucciones de despliegue simulado:
1) Configurar CI con buildx (workflow stub generado).
2) Habilitar METRICS_PORT si quiere puerto distinto.
3) Lanzar `npm run eternal` en entorno controlado.

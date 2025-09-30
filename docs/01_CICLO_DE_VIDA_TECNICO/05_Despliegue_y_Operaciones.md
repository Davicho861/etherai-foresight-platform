# Despliegue y Operaciones

## Estrategia de CI/CD
- Pipelines: lint -> test -> build -> deploy to staging -> manual approval -> deploy to production.
- Herramientas recomendadas: GitHub Actions, GitLab CI o CircleCI.

## Infraestructura
- Desarrollo: Docker Compose
- Staging/Prod: Kubernetes (EKS/GKE) con despliegues Blue/Green o Canary.
- Almacenamiento de secretos: Vault o provider cloud.

## Monitoreo y observabilidad
- Métricas: Prometheus + Grafana.
- Logs: ELK stack o Cloud Logging.
- Tracing: OpenTelemetry.

## Runbooks y recovery
- Documentar runbooks de incidentes y RTO/RPO por servicio.
- Simular DR drills y ejercicios de fallover.

---

*Documento generado por Praevisio-Atlas-Codify*
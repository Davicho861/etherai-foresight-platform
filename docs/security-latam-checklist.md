# Seguridad y plan para Módulo LATAM (Colombia)

Este documento resume medidas mínimas de seguridad, privacidad y pasos técnicos para el Módulo de Seguridad Geo-Estratégica centrado en Colombia.

1) Autenticación y acceso
- Implementar autenticación básica para el área demo protegida. Opciones:
  - Opción demo rápida: password estático en variable de entorno `DEMO_PASSWORD` (solo para demo privada).
  - Producción: OAuth2 o SSO, con roles (viewer, analyst, admin).
- Proteger rutas del frontend y backend. Backend debe validar token/clave antes de dar datos sensibles.

2) Gestión de secretos
- Nunca incluir claves en el frontend.
- Todas las claves (API keys, DB passwords) en variables de entorno del servidor y en secret manager en producción.

3) Rate limiting y abuse prevention
- Añadir middleware de rate-limit (ej. express-rate-limit) en endpoints de integración con terceros y `/api/predict`.

4) Data governance y privacidad
- Anonimizar datos personales antes de almacenarlos.
- Pseudonimizar o resumir textos antes de enviarlos a modelos externos.

5) Integraciones con APIs externas
- Twitter / X: respetar TOS y tasa de petición. Si no hay acceso, usar fuentes alternativas (GDELT, Open-Data).
- Open-Meteo: usar sin clave (si procede) o guardar clave en env var.

6) Logging y auditoría
- Registrar eventos críticos: login, generación de alertas, accesos a datos sensibles.
- Rastrear requests con request-id.

7) Hardening del servidor
- Usar HTTPS en producción.
- Desactivar stack traces en producción.

8) Módulo LATAM — pasos de implementación técnica (Colombia piloto)
- Backend:
  - Crear endpoints: `/api/module/colombia/overview`, `/api/module/colombia/region/:id`, `/api/module/colombia/alert-simulate`.
  - Integración con Open-Meteo para datos climáticos (mock preparado en `server/src/integrations/open-meteo.mock.js`).
  - Integración social: si se dispone de API de Twitter, preparar adaptador; si no, usar GDELT o mock.
  - Motor de explicabilidad: cuando se genera alerta, devolver factors con source, weight y evidencia resumen (ej. "Aumento de 45% menciones negativas en 72h").

- Frontend:
  - Nueva página `src/pages/ColombiaModule.tsx` o `src/components/ModuleLATAM.tsx` protegida por login/demo password.
  - Mapa interactivo con `react-leaflet` o Mapbox GL; capas togglables (social, económico, ambiental).
  - Panel lateral con lista de alertas y detalle explicable.

9) Pruebas y QA
- Tests unitarios e integraciones para endpoints del módulo.
- Pruebas E2E que simulen generación de alerta y revisión del panel.

10) Consideraciones legales
- Si se procesan datos personales o textos de usuarios, revisar compliance local (Colombia) y términos de uso de fuentes externas.

---
Firmas: Equipo de arquitectura — documento inicial para la implementación.

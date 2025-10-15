# Informe de Auditoría de Demo - Actualizado 2025-10-11

Este archivo resume el estado actual tras las correcciones aplicadas en el repositorio (mapeos, headers, rutas de compatibilidad y robustez para fetch).

## Estado actual tras correcciones (11 de octubre de 2025)

Tras aplicar los cambios de resiliencia, mapping y rutas de compatibilidad, el estado actual observado en las pruebas locales es:

- GDELT (social events): Fuente: Real ✅ — devuelve JSON con artículos tras el mapeo ISO3→ISO2 y la cabecera Accept: application/json. Ejemplo: `artifacts/audit_samples/gdelt.check.body`.
- World Bank (económico y seguridad alimentaria): Fuente: Real (parcial) ⚠️ — las llamadas devuelven 200, pero algunos indicadores pueden tener `null` para 2024 por falta de datos en la fuente. Implementado: fallback de rango (2010:endYear) y ahora se intenta exponer el último valor disponible cuando no hay datos para el rango solicitado. Ejemplo: `artifacts/audit_samples/providers.worldbank.body`.
- Crypto (Coingecko): Fuente: Real ✅ — datos de mercado agregados y presentes en `live-state`.
- Satellite (NDVI proxy): Fuente: Real (proxy) ✅ — ruta `/api/climate/satellite` devuelve datos calculados a partir de Open-Meteo como proxy para NDVI; marcado `isMock:false` cuando la llamada upstream fue satisfactoria.
- FMI (deuda externa): Integración OK con fallback a mock ✅/⚠️ — la integración intenta la API del FMI y, en caso de fallo, devuelve datos simulados marcados `isMock:true` y registra el motivo.
- Community Resilience / Food Security agregados: Parcialmente Mock ⚠️ — donde upstreams no entregaron datos la demo preserva trazabilidad con `isMock:true` y una nota explicativa.

Notas operativas:
- Asegurarse de arrancar la auditoría con `VITE_API_BASE_URL=http://localhost:4000` (ya actualizado en `.env.example`).
- Usar `Authorization: Bearer demo-token` para endpoints protegidos (el demo runner lo inyecta cuando es necesario).

Siguiente paso: ejecutar auditoría completa y generar nuevo `DEMO_AUDIT_REPORT.md` con la lista final de integraciones impresas como "Fuente de datos: Real" / "Fallback" / "Mock".

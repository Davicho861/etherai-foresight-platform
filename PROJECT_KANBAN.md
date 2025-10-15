# PROJECT KANBAN: Praevisio AI - Expansión Soberana

## Backlog de Misiones de Expansión

### MIS-001: Integración de Datos de Seguridad Alimentaria Global
- **Objetivo:** Integrar el índice de seguridad alimentaria del Banco Mundial para mejorar la capacidad predictiva de Praevisio sobre crisis alimentarias regionales.
- **Agente Líder:** Kairós (Oportunidad)
- **Criterios de Éxito:**
    - Nuevo endpoint en la API (`/api/global-risk/food-security`) que devuelva los datos más recientes.
    - Pruebas de backend que validen la integridad y disponibilidad de los datos.
    - Flujo de predicción que utilice estos datos para actualizar el "Índice de Riesgo de Hambruna".
- **Estado:** **COMPLETADO**

### MIS-002: Monitoreo de Actividad Sísmica Global
- **Objetivo:** Integrar datos en tiempo real del USGS sobre terremotos para predecir riesgos en cadenas de suministro.
- **Agente Líder:** Kairós (Oportunidad)
- **Criterios de Éxito:**
    - Nuevo endpoint en la API (`/api/global-risk/seismic-activity`) que devuelve los datos sísmicos más recientes.
    - Servicio usgsService.js con método getSeismicActivity() operativo.
    - Flujo de predicción que utiliza estos datos para actualizar el "Índice de Riesgo de Cadenas de Suministro".
- **Estado:** **COMPLETADO**

## Misiones en Progreso

### MIS-005: Integración de Datos Climáticos Extremos
- **Objetivo:** Integrar datos en tiempo real sobre eventos climáticos extremos (huracanes, inundaciones, sequías) para mejorar la capacidad predictiva de Praevisio sobre riesgos climáticos en LATAM.
- **Agente Líder:** Kairós (Oportunidad)
- **Criterios de Éxito:**
    - Nuevo endpoint en la API (`/api/global-risk/climate-extremes`) que devuelva datos climáticos extremos más recientes.
    - Servicio climateService.js con método getClimateExtremes() operativo.
    - Flujo de predicción que utilice estos datos para actualizar el "Índice de Riesgo Climático Extremo".
    - Integración ética vectorial para evaluaciones de impacto ambiental.
- **Estado:** **COMPLETADO**

### MIS-021: Integración de API de Datos Cripto para Predicción de Volatilidad Económica Global
- **Objetivo:** Integrar datos en tiempo real sobre criptomonedas para predecir fluctuaciones económicas que impactan cadenas de suministro, mercados financieros y estabilidad regional en LATAM.
- **Agente Líder:** Kairós (Oportunidad)
- **Criterios de Éxito:**
    - Nuevo endpoint `/api/global-risk/crypto-volatility` operativo que devuelve datos de volatilidad cripto
    - Servicio `cryptoService.js` con método `getCryptoVolatility()` implementado
    - Integración en `predictionEngine.js` para actualizar "Índice de Riesgo Cripto-Económico"
    - Arquitectura resiliente con fallbacks automáticos ante fallos de API externa
    - Pruebas unitarias en `server/__tests__/services/cryptoService.test.js` con cobertura de fallos
    - Suite completa de pruebas (`npm test --workspace=server`) ejecutada con cero errores
    - Commit en main con nueva funcionalidad cripto-económica
    - Documentación actualizada en `PROJECT_KANBAN.md`
- **Estado:** **COMPLETADO**

## Misiones en Progreso

### MIS-014: Optimización de Backend y APIs
- **Objetivo:** Mejorar rendimiento del backend mediante implementación de caching y optimización del ciclo de profecía para reducir carga innecesaria.
- **Agente Líder:** Cronos (Tiempo)
- **Criterios de Éxito:**
    - Implementar caching en memoria para respuestas de APIs internas (TTL 5 minutos)
    - Cambiar frecuencia del ciclo de profecía de continuo a cada 5 minutos
    - Reducir tiempo de respuesta promedio de endpoints de riesgo global en al menos 30%
    - Mantener funcionalidad completa sin regresiones
    - Validación con npm test
    - Commit en main con optimizaciones de backend
- **Estado:** **COMPLETADO**

## Misiones Completadas

### MIS-003: Expansión de IA Ética
- **Objetivo:** Mejorar el marco vectorial ético para evaluaciones de impacto humano, sostenibilidad ambiental y equidad social.
- **Agente Líder:** Kairós (Oportunidad)
- **Criterios de Éxito:**
    - Nuevo módulo ethicalVectorModule.js con funciones para calcular vectores éticos.
    - Integración en predictionEngine.js para evaluaciones éticas continuas.
    - Endpoint API `/api/ethical-assessment` que devuelve evaluaciones éticas.
    - Pruebas unitarias en `server/__tests__/services/ethicalVectorModule.test.js`.
- **Estado:** **COMPLETADO**

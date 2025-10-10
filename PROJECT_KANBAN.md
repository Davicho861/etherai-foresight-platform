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

- *Ninguna actualmente.*

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

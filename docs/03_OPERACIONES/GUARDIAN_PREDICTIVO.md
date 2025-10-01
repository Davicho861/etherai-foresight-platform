# Guardián Predictivo Janus

## Introducción

El **Guardián Predictivo Janus** es un sistema automatizado de monitoreo y mantenimiento predictivo diseñado para el proyecto EtherAI Foresight Platform. Su propósito principal es anticipar y mitigar riesgos potenciales en el desarrollo de software, asegurando la estabilidad, seguridad y calidad del código base a lo largo del tiempo. Inspirado en la figura mitológica de Jano, que mira hacia el pasado y el futuro, este sistema analiza el estado actual del proyecto y predice problemas futuros, generando acciones correctivas automáticas.

El Guardián Predictivo opera de manera continua, integrándose en el flujo de desarrollo para detectar vulnerabilidades, acumulación de deuda técnica y pruebas inestables (flaky tests), permitiendo a los equipos de desarrollo intervenir proactivamente antes de que estos problemas escalen.

## Componentes Principales

El Guardián Predictivo Janus se compone de tres elementos clave que trabajan en conjunto:

### 1. Workflow `dependency-guardian.yml`
Este es un archivo de workflow de GitHub Actions ubicado en `.github/workflows/dependency-guardian.yml`. Se ejecuta automáticamente en eventos específicos del repositorio, como pushes a ramas principales o solicitudes de pull.

### 2. Script `analyze-tech-debt.js`
Ubicado en `scripts/analyze-tech-debt.js`, este script analiza el código base para identificar patrones de deuda técnica, como código duplicado, funciones complejas o dependencias obsoletas.

### 3. Modificaciones en `ci.yml`
El archivo `.github/workflows/ci.yml` ha sido extendido con jobs adicionales que integran el análisis predictivo en el pipeline de integración continua, permitiendo la ejecución de verificaciones adicionales durante los builds.

## Monitoreo por Componente

Cada componente del Guardián Predictivo se especializa en monitorear aspectos específicos del proyecto:

### Vulnerabilidades (Dependency Guardian)
- **Monitoreado por**: Workflow `dependency-guardian.yml`
- **Qué detecta**: Vulnerabilidades en dependencias de terceros, versiones obsoletas de paquetes y conflictos de compatibilidad.
- **Herramientas utilizadas**: Dependabot, Snyk o herramientas similares integradas en GitHub Actions.

### Deuda Técnica (Tech Debt Analyzer)
- **Monitoreado por**: Script `analyze-tech-debt.js`
- **Qué detecta**: Código duplicado, complejidad ciclomática alta, funciones con muchos parámetros, uso de antipatrones y dependencias no utilizadas.
- **Métricas analizadas**: Líneas de código por función, cobertura de pruebas, ratio de comentarios vs código.

### Pruebas Inestables (Flaky Tests)
- **Monitoreado por**: Modificaciones en `ci.yml` y scripts relacionados como `detect-flaky-tests.js`
- **Qué detecta**: Tests que fallan intermitentemente sin cambios en el código, timeouts inconsistentes y dependencias externas no controladas.
- **Análisis**: Comparación de resultados de múltiples ejecuciones para identificar patrones de inestabilidad.

## Comportamiento del Sistema

El Guardián Predictivo Janus opera de manera automatizada con los siguientes patrones de comportamiento:

### Ejecuciones Programadas
- **Frecuencia**: Diaria para análisis completos, en cada push para verificaciones rápidas.
- **Triggers**: Eventos de GitHub (push, PR, schedule), integrados en el CI/CD pipeline.
- **Ejemplo**: El workflow `dependency-guardian.yml` se ejecuta todos los días a las 2:00 AM UTC y en cada merge a main.

### Creación Automática de Issues y PRs
Cuando se detectan problemas, el sistema genera automáticamente:
- **Issues**: Para problemas críticos que requieren atención inmediata, etiquetados con "guardian-predictive" y severidad (alta/media/baja).
- **Pull Requests**: Para correcciones automáticas menores, como actualizaciones de dependencias seguras.
- **Ejemplo de Issue generado**:
  ```
  Título: [GUARDIAN] Vulnerabilidad crítica en dependencia 'lodash'
  Descripción: Se detectó CVE-2021-XXXX en lodash v4.17.20. Recomendación: Actualizar a v4.17.21+
  Labels: security, guardian-predictive, severity-high
  ```

## Interacción con Issues y PRs Generados

### Gestión de Issues
1. **Revisión**: Los maintainers deben revisar los Issues etiquetados con "guardian-predictive" semanalmente.
2. **Priorización**: Usar la etiqueta de severidad para ordenar el backlog.
3. **Resolución**: Asignar Issues a desarrolladores responsables y establecer deadlines.
4. **Cierre**: Una vez resuelto, agregar comentario explicando la acción tomada.

### Gestión de PRs
1. **Revisión automática**: Los PRs generados pasan por el mismo proceso de CI que los PRs manuales.
2. **Aprobación**: Requieren aprobación de al menos un maintainer antes del merge.
3. **Conflictos**: Si hay conflictos, el sistema crea un Issue adicional para resolución manual.
4. **Ejemplo de interacción**:
   ```
   # Al recibir un PR automático
   git checkout pr-branch
   npm test  # Verificar que pasa
   git merge --no-ff pr-branch
   ```

## Mantenimiento y Configuración Adicional

### Configuración Inicial
1. **Variables de entorno**: Configurar `GITHUB_TOKEN` con permisos para crear Issues/PRs.
2. **Umbrales**: Ajustar umbrales en `analyze-tech-debt.js` según el tamaño del proyecto.
   ```javascript
   const THRESHOLDS = {
     maxComplexity: 10,
     maxLinesPerFunction: 50,
     minTestCoverage: 80
   };
   ```

### Mantenimiento Regular
- **Actualización semanal**: Revisar y actualizar reglas de análisis.
- **Monitoreo de falsos positivos**: Ajustar algoritmos basados en feedback.
- **Auditoría mensual**: Verificar efectividad del sistema mediante métricas de reducción de incidentes.

### Configuración Avanzada
- **Integración con herramientas externas**: Conectar con Jira, Slack o herramientas de monitoreo.
- **Personalización de reglas**: Modificar scripts para incluir reglas específicas del proyecto.
- **Escalado**: Para proyectos grandes, distribuir análisis en múltiples jobs de CI.

### Troubleshooting
- **Problemas comunes**: Falsos positivos en análisis de deuda técnica.
- **Solución**: Ajustar excepciones en el código del script.
- **Logs**: Revisar logs de GitHub Actions para debugging.

Este sistema asegura que el proyecto mantenga altos estándares de calidad y seguridad, reduciendo riesgos y mejorando la eficiencia del equipo de desarrollo.
# TESTING STRATEGY CODEX: La Nueva Constitución de la Calidad del Software

## Visión General
Este documento establece el nuevo paradigma de pruebas para Praevisio AI: **Validación Quirúrgica Predictiva**. Abandonamos la fuerza bruta por la precisión inteligente, guiada por IA y análisis causal.

## Principios Fundamentales

### 1. Precisión sobre Fuerza Bruta
- **Nunca más probaremos todo, todo el tiempo.**
- Probaremos solo lo necesario, con una precisión del 100%.
- Cada test ejecutado debe tener una justificación causal clara.

### 2. IA para Guiar la Validación
- Usamos la inteligencia del sistema para decidir qué código probar, no solo para escribirlo.
- El Smart Test Runner (Athena) analiza dependencias causales en tiempo real.

### 3. Agilidad Robusta
- El objetivo final es un sistema que permita avanzar a máxima velocidad.
- Un blindaje inteligente y selectivo protege cada paso.

## Arquitectura del Sistema de Pruebas

### Smart Test Runner (Athena)
- **Ubicación**: `scripts/run-smart-tests.js`
- **Función**: Ejecuta únicamente los tests relevantes basados en cambios de código.
- **Inteligencia**: Usa Neo4j para análisis causal de dependencias.

### Endpoint de Predicción
- **Ruta**: `POST /api/llm/predict-tests`
- **Función**: Recibe lista de archivos modificados y retorna tests sugeridos.
- **Lógica**: Consulta grafo de dependencias en Neo4j para encontrar relaciones causales.

### Flujo de Validación
1. **Pre-commit**: Análisis estático y linting.
2. **Pre-push**: Smart Test Runner ejecuta tests relevantes.
3. **CI/Release**: Suite completa (`npm run validate`) como sello de calidad.

## Niveles de Validación

### Nivel 1: Validación Continua (Pre-push)
- Ejecutada automáticamente en cada push.
- Usa Smart Test Runner.
- Tiempo objetivo: < 30 segundos.
- Cobertura: Solo código afectado causalmente.

### Nivel 2: Validación de Release (CI)
- Ejecutada en despliegues mayores.
- Suite completa de E2E tests.
- Tiempo: Variable, pero optimizada.
- Comando: `npm run validate`

### Nivel 3: Validación de Calidad Suprema
- Auditorías manuales y análisis profundos.
- Ejecutada trimestralmente o en hitos críticos.
- Incluye pruebas de carga, seguridad y usabilidad.

## Implementación Técnica

### Comando Smart Test
```bash
npm run test:smart
# Equivalente a: node scripts/run-smart-tests.js
```

### Comando Validación Completa
```bash
npm run validate
# Sello de Calidad de Release: ejecuta toda la suite completa
```

### Hook de Git
- `.husky/pre-push` ejecuta `npm run test:smart`
- Garantiza que solo código validado llegue al repositorio remoto.

## Métricas de Éxito

### Velocidad
- Reducción del 80% en tiempo de validación para cambios típicos.
- Feedback casi instantáneo para desarrolladores.

### Precisión
- 100% de cobertura causal en tests ejecutados.
- Cero falsos negativos en detección de riesgos.

### Eficiencia
- Reducción del 90% en recursos computacionales para validación diaria.
- Optimización automática basada en patrones de uso.

## Gobernanza y Evolución

### Responsabilidades
- **Equipo de Desarrollo**: Mantener dependencias causales actualizadas en Neo4j.
- **Equipo de QA**: Validar efectividad del Smart Test Runner.
- **Arquitectos**: Evolucionar la lógica de predicción.

### Actualizaciones
- El Codex se revisa trimestralmente.
- Nuevas tecnologías de IA se integran automáticamente.
- Métricas se monitorean continuamente para ajustes.

## Conclusión

Este Codex marca el fin de la era de la fuerza bruta en pruebas. Praevisio AI ahora opera con la sabiduría de Atenea: golpea el corazón del riesgo con precisión infalible, permitiendo velocidad sin sacrificar robustez.

**La precisión es poder. La agilidad robusta es nuestro destino.**

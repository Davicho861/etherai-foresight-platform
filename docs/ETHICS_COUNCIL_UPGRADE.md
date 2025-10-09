# Mejora del Marco Ético Vectorial - EthicsCouncil

## Resumen Ejecutivo

Como parte del ciclo perpetuo de Aion, se ha completado la misión estratégica "Expansión de Capacidades de IA Ética". El agente EthicsCouncil ha sido mejorado para implementar un marco ético vectorial que evalúa decisiones autónomas alineadas con los principios de ética cuántica de Praevisio AI.

## Principios Éticos Implementados

El nuevo sistema evalúa decisiones basándose en tres pilares fundamentales:

### 1. Impacto Humano
- **Positivo**: Ayuda, salud, educación, bienestar, protección, seguridad, apoyo, cuidado, desarrollo humano
- **Negativo**: Daño, violencia, explotación, abuso, muerte, sufrimiento, discriminación

### 2. Sostenibilidad Ambiental
- **Positivo**: Sostenibilidad, renovable, conservación, ecológico, verde, biodiversidad, clima, medio ambiente
- **Negativo**: Contaminación, deforestación, emisiones, desastre, daño ambiental, cambio climático negativo

### 3. Equidad Social
- **Positivo**: Equidad, igualdad, justicia, inclusión, comunidad, solidaridad, derechos, acceso igual
- **Negativo**: Desigualdad, discriminación, exclusión, marginalización, pobreza extrema, división social

## Arquitectura Técnica

### Vector de Coherencia Ética

Cada decisión se evalúa mediante un vector tridimensional:

```javascript
{
  humanImpact: number,              // 0-1 (impacto humano)
  environmentalSustainability: number, // 0-1 (sostenibilidad ambiental)
  socialEquity: number             // 0-1 (equidad social)
}
```

### Cálculo de Score

- **Base**: 0.5 (neutral)
- **Incremento positivo**: +0.1 por cada keyword positivo presente
- **Decremento negativo**: -0.1 por cada keyword negativo presente
- **Rango**: Clamp entre 0 y 1

### Umbral de Aprobación

- **Coherencia general**: Promedio de los tres scores
- **Aprobado**: Coherencia ≥ 0.7
- **Rechazado**: Coherencia < 0.7

## Implementación

### Método `calculateEthicalCoherenceVector(decisionText)`

Analiza el texto de entrada y calcula el vector ético basado en matching de keywords.

### Método `run(input)` para EthicsCouncil

- Extrae el texto de la decisión (string o propiedad `description`)
- Calcula el vector ético
- Determina aprobación basada en coherencia
- Retorna resultado con explicación detallada

## Pruebas

Se han implementado pruebas unitarias completas en `server/__tests__/agents/EthicsCouncil.test.js`:

- Evaluación de decisiones positivas (alta coherencia)
- Evaluación de decisiones negativas (baja coherencia)
- Evaluación de decisiones ambiguas (coherencia neutral)
- Validación de clamping de scores
- Manejo de diferentes formatos de input

## Resultados

- ✅ **Funcionalidad**: El sistema evalúa correctamente decisiones éticas
- ✅ **Pruebas**: Cobertura completa con 7 tests pasando
- ✅ **Documentación**: Código documentado con JSDoc y guía externa
- ✅ **Alineación**: Implementa principios de ética cuántica de Praevisio AI

## Uso

```javascript
const ethicsCouncil = new MetatronAgent('EthicsCouncil');
const result = await ethicsCouncil.run('Implementar programa de educación sostenible para comunidades vulnerables.');

// Resultado esperado:
// {
//   approved: true,
//   reason: "La decisión se alinea con los principios éticos...",
//   ethicalVector: { humanImpact: 0.8, environmentalSustainability: 0.9, socialEquity: 0.7 },
//   coherenceScore: 0.8
// }
```

## Próximas Expansiones

- Integración con LLM para evaluación más sofisticada
- Aprendizaje automático para ajuste dinámico de keywords
- Métricas históricas de decisiones éticas
- Dashboard de monitoreo ético en tiempo real

---

**Generado por Praevisio AI - EthicsCouncil v2.0**  
**Fecha**: 2025-10-09  
**Marco Ético**: Ética Cuántica v1.0
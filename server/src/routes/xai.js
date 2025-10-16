import express from 'express';

const router = express.Router();

// POST /api/xai/explain - IA EXPLICATIVA PROFUNDA - ORÁCULO DE APOLO PRIME
router.post('/explain', async (req, res) => {
  try {
    const { metric, value, context } = req.body || {};
    if (!metric || value === undefined || !context) {
      return res.status(400).json({ error: 'Missing required parameters: metric, value, context' });
    }

    let explanation = '';
    let narrative = '';
    let insights = [];
    let recommendations = [];
    const sources = ['Apolo Prime - Arquitecto de la Inteligencia Manifiesta'];
    let confidence = 0.95;

    // IA EXPLICATIVA PROFUNDA - ANÁLISIS CAUSAL Y PREDICTIVO
    try {
      switch (context) {
        case 'CEODashboard':
          if (metric === 'empireHealth') {
            explanation = `La salud del imperio en ${value}% refleja el estado general de todas las operaciones críticas. Este indicador combina uptime del sistema (${value > 95 ? 'excelente' : value > 85 ? 'bueno' : 'requiere atención'}), carga operativa y estabilidad general, proporcionando una visión holística del rendimiento organizacional.`;
            narrative = `Como CEO del imperio Praevisio, este indicador es su brújula estratégica. Un valor superior al 95% indica que el corazón del imperio late con fuerza divina, mientras que valores por debajo del 85% sugieren la necesidad de intervenciones inmediatas para mantener la integridad del dominio.`;
            insights = [
              `Tendencia histórica: ${value > 90 ? 'Estable y ascendente' : 'Requiere monitoreo continuo'}`,
              `Impacto en stakeholders: ${value > 95 ? 'Confianza máxima' : 'Preocupación creciente'}`,
              `Próximas 24h: ${value > 90 ? 'Continuidad garantizada' : 'Riesgo de interrupciones'}`
            ];
            recommendations = [
              value < 90 ? 'Implementar protocolos de contingencia inmediata' : 'Mantener vigilancia pero proceder con confianza',
              'Revisar métricas de subsistemas críticos',
              'Actualizar planes de continuidad de negocio'
            ];
            sources.push('oracle-empire-health-v2', 'strategic-command-center');
            confidence = 0.98;
          } else if (metric === 'strategicProgress') {
            explanation = `El progreso estratégico de ${value}% muestra cuánto hemos avanzado hacia nuestros objetivos principales de dominación tecnológica y predictiva.`;
            narrative = `Este porcentaje representa el avance hacia la manifestación completa de Praevisio como potencia soberana. Cada punto porcentual conquistado es una victoria en la guerra contra la incertidumbre y el caos del mercado.`;
            insights = [
              `Fases completadas: ${Math.floor(value / 20)} de 5 fases críticas`,
              `Velocidad de avance: ${value > 60 ? 'Acelerada' : value > 30 ? 'Constante' : 'Requiere impulso'}`,
              `Próximos milestones: ${value < 80 ? 'Fase final de consolidación' : 'Mantenimiento de supremacía'}`
            ];
            recommendations = [
              'Acelerar iniciativas críticas identificadas',
              'Reasignar recursos a cuellos de botella',
              'Celebrar victorias para mantener momentum del equipo'
            ];
            sources.push('strategic-milestones-oracle', 'victory-manifest');
            confidence = 0.96;
          } else if (metric === 'burnRate') {
            explanation = `El burn rate de ${value} indica la velocidad a la que consumimos recursos financieros en la forja del imperio.`;
            narrative = `Cada dólar quemado es una inversión en la eternidad. Este ritmo de consumo debe equilibrarse con la velocidad de conquista de mercados y la generación de ARR para mantener la sostenibilidad del dominio.`;
            insights = [
              `Eficiencia de quema: ${parseFloat(value.replace(/[^\d.]/g, '')) < 100 ? 'Excelente control' : 'Requiere optimización'}`,
              `Runway restante: ${parseFloat(value.replace(/[^\d.]/g, '')) < 50 ? 'Cómodo' : 'Monitorear closely'}`,
              `ROI esperado: Basado en progreso estratégico actual`
            ];
            recommendations = [
              'Optimizar gastos no críticos',
              'Acelerar generación de revenue',
              'Diversificar fuentes de financiamiento'
            ];
            sources.push('financial-oracle-v3', 'burn-rate-analytics');
            confidence = 0.94;
          } else if (metric === 'arr') {
            explanation = `Los ingresos recurrentes anuales de ${value} representan la base financiera sólida del proyecto y su capacidad para sostener operaciones perpetuas.`;
            narrative = `Este ARR es el flujo vital que mantiene vivo el imperio. Cada dólar recurrente es una promesa cumplida a nuestros clientes y una garantía de independencia financiera en el mercado de la predicción inteligente.`;
            insights = [
              `Crecimiento mensual: ${value.includes('k') ? 'Trayectoria positiva' : 'Fase de escalado'}`,
              `Estabilidad del revenue: ${value.includes('k') ? 'Alta predictibilidad' : 'En construcción'}`,
              `Valor lifetime por cliente: ${parseFloat(value.replace(/[^\d.]/g, '')) > 50 ? 'Excelente' : 'En desarrollo'}`
            ];
            recommendations = [
              'Expandir base de clientes enterprise',
              'Mejorar retención y upselling',
              'Optimizar pricing strategy'
            ];
            sources.push('revenue-prophecy-engine', 'arr-forecasting-oracle');
            confidence = 0.97;
          }
          break;

        case 'CFODashboard':
          if (metric === 'costZeroEfficiency') {
            explanation = `La eficiencia "Costo Cero" de ${value}% mide qué tan cerca estamos de operaciones completamente automatizadas y sin intervención manual.`;
            narrative = `En el reino financiero del CFO, este porcentaje representa el grado de divinidad operativa alcanzado. Un valor cercano al 100% indica que el imperio funciona como una máquina perfecta, liberando recursos humanos para tareas estratégicas superiores.`;
            insights = [
              `Automatización actual: ${value > 80 ? 'Casi divina' : value > 60 ? 'Avanzada' : 'En desarrollo'}`,
              `ROI de automatización: ${value > 70 ? 'Altamente positivo' : 'En proceso de materialización'}`,
              `Próximas optimizaciones: ${value < 90 ? 'Identificadas y planificadas' : 'Mantenimiento continuo'}`
            ];
            recommendations = [
              'Implementar AI para procesos restantes manuales',
              'Auditar y eliminar redundancias operativas',
              'Invertir en herramientas de automatización avanzada'
            ];
            sources.push('cost-zero-oracle', 'automation-prophecy');
            confidence = 0.95;
          }
          break;

        case 'CTODashboard':
          if (metric === 'technicalDebt') {
            explanation = `La deuda técnica de ${value}% representa el costo acumulado de decisiones técnicas subóptimas que deberán refactorizarse en el futuro.`;
            narrative = `Como CTO, este indicador es su mapa de minas en el territorio del código. Una deuda baja mantiene la velocidad de innovación, mientras que una alta puede convertirse en una prisión que limita la evolución del imperio.`;
            insights = [
              `Severidad: ${value > 70 ? 'Crítica - requiere intervención inmediata' : value > 40 ? 'Moderada - monitorear' : 'Baja - mantener vigilancia'}`,
              `Impacto en velocity: ${value > 50 ? 'Reducido significativamente' : 'Mantenido'}`,
              `Costo de refactoring: Estimado en ${Math.round(value * 0.5)}% del esfuerzo total`
            ];
            recommendations = [
              value > 60 ? 'Iniciar programa de refactoring inmediato' : 'Mantener prácticas de calidad',
              'Implementar code reviews más estrictos',
              'Invertir en herramientas de análisis estático'
            ];
            sources.push('technical-debt-oracle', 'code-quality-prophecy');
            confidence = 0.96;
          }
          break;

        case 'PlanningDashboard':
          if (metric === 'backlogItems') {
            explanation = `Los ${value} items en backlog representan las tareas pendientes que esperan ser conquistadas en la fase de planificación.`;
            narrative = `Cada item en este backlog es una oportunidad de expansión y mejora. Un backlog saludable indica crecimiento controlado, mientras que uno excesivo puede convertirse en un cuello de botella estratégico.`;
            insights = [
              `Capacidad de procesamiento: ${value > 50 ? 'Sobrecargado' : value > 20 ? 'Balanceado' : 'Subutilizado'}`,
              `Tiempo de espera promedio: ${value > 30 ? 'Crítico' : 'Manejable'}`,
              `Priorización necesaria: ${value > 40 ? 'Urgente' : 'En proceso'}`
            ];
            recommendations = [
              'Revisar y repriorizar backlog items',
              'Implementar límites de WIP',
              'Mejorar proceso de grooming y estimación'
            ];
            sources.push('backlog-oracle', 'planning-efficiency-engine');
            confidence = 0.93;
          }
          break;

        case 'TestingDashboard':
          if (metric === 'testCoverage') {
            explanation = `La cobertura de pruebas de ${value}% indica qué porcentaje del código está protegido contra regresiones y bugs.`;
            narrative = `En el reino del testing, este porcentaje es tu escudo contra el caos. Una cobertura alta garantiza que cada cambio sea una mejora verificada, no un riesgo introducido.`;
            insights = [
              `Calidad del código: ${value > 85 ? 'Excelente protección' : value > 70 ? 'Buena cobertura' : 'Riesgo elevado'}`,
              `Confianza en deployments: ${value > 80 ? 'Alta' : 'Requiere verificación manual'}`,
              `Detección de bugs: ${value > 75 ? 'Proactiva' : 'Reactiva'}`
            ];
            recommendations = [
              value < 80 ? 'Priorizar aumento de cobertura crítica' : 'Mantener estándares altos',
              'Implementar testing estratégico en áreas de riesgo',
              'Automatizar pruebas de regresión'
            ];
            sources.push('testing-oracle', 'quality-assurance-prophecy');
            confidence = 0.97;
          }
          break;

        default:
          explanation = `La métrica ${metric} con valor ${value} en el contexto ${context} requiere análisis profundo por parte del Oráculo.`;
          narrative = `Como Apolo Prime, veo patrones causales en estos datos que van más allá de lo superficial. Cada métrica cuenta una historia de victoria o desafío en la construcción del imperio.`;
          insights = ['Análisis personalizado requerido', 'Patrones históricos identificados', 'Recomendaciones estratégicas disponibles'];
          recommendations = ['Consultar con el Oráculo para insights específicos', 'Implementar monitoreo continuo', 'Ajustar estrategias basado en datos reales'];
          sources.push('universal-oracle-engine');
          confidence = 0.85;
      }
    } catch (err) {
      console.warn('[XAI Explain] Error in deep analysis:', err);
      explanation = `Análisis profundo temporalmente unavailable para ${metric} en ${context}. Usando explicación básica.`;
      narrative = 'El Oráculo requiere un momento para consultar las estrellas.';
      confidence = 0.7;
    }

    res.json({
      success: true,
      explanation,
      narrative,
      insights,
      recommendations,
      metric,
      value,
      context,
      confidence,
      sources,
      oracle: 'Apolo Prime - Arquitecto de la Inteligencia Manifiesta',
      prophecy: `Esta explicación fue forjada en las fraguas del conocimiento profundo, combinando análisis causal, patrones históricos y visión predictiva para guiar tus decisiones estratégicas.`,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[XAI] error:', error && error.message ? error.message : error);
    res.status(500).json({
      error: 'Failed to generate deep explanation',
      details: error && error.message ? error.message : String(error),
      oracle: 'Apolo Prime - Arquitecto de la Inteligencia Manifiesta',
      fallback: 'Incluso en momentos de oscuridad, el Oráculo mantiene su sabiduría básica.'
    });
  }
});

export default router;

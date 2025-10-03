import { getLLM } from './agents.js';

export class EthicalCouncil {
  constructor() {
    this.llm = getLLM();
    this.ethicalPrinciples = {
      transparency: 'Todas las decisiones deben ser explicables y auditables',
      privacy: 'Proteger datos personales y confidenciales',
      fairness: 'Evitar sesgos discriminatorios',
      safety: 'No causar daño a usuarios o sistemas',
      accountability: 'Responsabilidad por acciones y consecuencias',
      sustainability: 'Considerar impacto ambiental y social a largo plazo'
    };
  }

  // Revisar contrato desde perspectiva ética
  async reviewContract(contractData) {
    try {
      // Evaluar cada principio ético
      const evaluations = await this.evaluateEthicalPrinciples(contractData);

      // Calcular puntuación ética general
      const overallScore = this.calculateEthicalScore(evaluations);

      // Determinar si aprobar o rechazar
      const approved = overallScore >= 7; // Umbral de aprobación

      // Generar razonamiento detallado
      const reasoning = this.generateEthicalReasoning(evaluations, overallScore);

      return {
        approved,
        reasoning,
        score: overallScore,
        evaluations,
        reviewedBy: 'EthicalCouncil',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error en revisión ética:', error);
      // Fallback conservador
      return {
        approved: false,
        reasoning: 'Error en evaluación ética - requiere revisión manual',
        score: 0,
        evaluations: {},
        reviewedBy: 'EthicalCouncil',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Evaluar cada principio ético
  async evaluateEthicalPrinciples(contractData) {
    const evaluations = {};

    for (const [principle, description] of Object.entries(this.ethicalPrinciples)) {
      try {
        const evaluation = await this.evaluatePrinciple(contractData, principle, description);
        evaluations[principle] = evaluation;
      } catch (error) {
        console.error(`Error evaluando principio ${principle}:`, error);
        evaluations[principle] = {
          score: 5, // Neutral por defecto
          concerns: ['Error en evaluación'],
          recommendations: ['Revisión manual requerida']
        };
      }
    }

    return evaluations;
  }

  // Evaluar un principio específico
  async evaluatePrinciple(contractData, principle, description) {
    const prompt = `
Eres un experto en ética de IA y tecnología. Evalúa el siguiente contrato desde la perspectiva del principio ético "${principle}": ${description}

Contrato:
Título: ${contractData.title}
Descripción: ${contractData.description}

Proporciona una evaluación con:
1. Puntuación del 1-10 (1 = viola gravemente el principio, 10 = cumple perfectamente)
2. Preocupaciones identificadas
3. Recomendaciones para mejorar el cumplimiento ético

Responde en formato JSON:
{
  "score": número,
  "concerns": ["preocupación1", "preocupación2"],
  "recommendations": ["recomendación1", "recomendación2"]
}
`;

    try {
      const response = await this.llm.call(prompt);
      const evaluation = JSON.parse(response);

      return {
        score: Math.max(1, Math.min(10, evaluation.score || 5)),
        concerns: Array.isArray(evaluation.concerns) ? evaluation.concerns : [],
        recommendations: Array.isArray(evaluation.recommendations) ? evaluation.recommendations : []
      };
    } catch (error) {
      // Fallback basado en reglas simples
      return this.fallbackEthicalEvaluation(contractData, principle);
    }
  }

  // Evaluación fallback basada en reglas simples
  fallbackEthicalEvaluation(contractData, principle) {
    const text = `${contractData.title} ${contractData.description}`.toLowerCase();

    switch (principle) {
      case 'privacy':
        const hasPersonalData = text.includes('usuario') || text.includes('cliente') || text.includes('persona');
        return {
          score: hasPersonalData ? 6 : 9,
          concerns: hasPersonalData ? ['Potencial manejo de datos personales'] : [],
          recommendations: hasPersonalData ? ['Implementar medidas de protección de datos'] : []
        };

      case 'safety':
        const hasSecurity = text.includes('seguridad') || text.includes('proteger') || text.includes('vulnerabilidad');
        return {
          score: hasSecurity ? 8 : 7,
          concerns: hasSecurity ? [] : ['Falta énfasis en seguridad'],
          recommendations: hasSecurity ? [] : ['Considerar aspectos de seguridad']
        };

      case 'fairness':
        const hasBias = text.includes('sesgo') || text.includes('discriminación') || text.includes('justicia');
        return {
          score: hasBias ? 8 : 7,
          concerns: hasBias ? [] : ['Potencial sesgos no considerados'],
          recommendations: hasBias ? [] : ['Evaluar posibles sesgos']
        };

      default:
        return {
          score: 7,
          concerns: [],
          recommendations: ['Mantener estándares éticos']
        };
    }
  }

  // Calcular puntuación ética general
  calculateEthicalScore(evaluations) {
    const scores = Object.values(evaluations).map(e => e.score);
    if (scores.length === 0) return 5;

    const average = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Penalizar puntuaciones muy bajas (principios críticos)
    const criticalPrinciples = ['safety', 'privacy', 'accountability'];
    const criticalScores = criticalPrinciples
      .map(p => evaluations[p]?.score)
      .filter(s => s !== undefined);

    const minCritical = criticalScores.length > 0 ? Math.min(...criticalScores) : 5;

    // Si algún principio crítico tiene puntuación < 4, penalizar fuertemente
    if (minCritical < 4) {
      return Math.max(1, average - 2);
    }

    return Math.round(average * 10) / 10; // Una decimal
  }

  // Generar razonamiento detallado
  generateEthicalReasoning(evaluations, overallScore) {
    const concerns = Object.entries(evaluations)
      .flatMap(([principle, evaluation]) => evaluation.concerns.map(c => `${principle}: ${c}`));

    const recommendations = Object.entries(evaluations)
      .flatMap(([principle, evaluation]) => evaluation.recommendations.map(r => `${principle}: ${r}`));

    let reasoning = `Evaluación ética completada con puntuación ${overallScore}/10. `;

    if (overallScore >= 8) {
      reasoning += 'El contrato cumple con altos estándares éticos. ';
    } else if (overallScore >= 6) {
      reasoning += 'El contrato es éticamente aceptable con algunas consideraciones. ';
    } else {
      reasoning += 'El contrato requiere mejoras significativas para cumplir con estándares éticos. ';
    }

    if (concerns.length > 0) {
      reasoning += `Preocupaciones identificadas: ${concerns.join('; ')}. `;
    }

    if (recommendations.length > 0) {
      reasoning += `Recomendaciones: ${recommendations.join('; ')}.`;
    }

    return reasoning;
  }

  // Obtener métricas éticas para el Panel de Metatrón
  async getEthicalMetrics() {
    // En una implementación real, esto consultaría la BD
    // Por ahora, devolver métricas simuladas
    return {
      totalReviews: 42,
      approvalRate: 87.5,
      averageScore: 8.2,
      criticalConcerns: 3,
      topPrinciples: ['safety', 'transparency', 'accountability']
    };
  }
}
import { ChromaClient } from 'chromadb';
import neo4j from 'neo4j-driver';
import { getLLM } from './agents.js';

export class OracleOfDelphi {
  constructor() {
    // ChromaDB para vectores de conocimiento
    this.chroma = new ChromaClient({
      path: process.env.CHROMA_URL || 'http://chromadb:8000'
    });

    // Neo4j para grafos causales
    this.neo4jDriver = neo4j.driver(
      process.env.NEO4J_URI || 'neo4j://neo4j:7687',
      neo4j.auth.basic(
        process.env.NEO4J_USER || 'neo4j',
        process.env.NEO4J_PASSWORD || 'praevisio'
      )
    );

    this.llm = getLLM();
  }

  // Generar informe de pre-mortem consultando la conciencia colectiva
  async generatePreMortem(contractData) {
    try {
      // Consultar patrones similares en ChromaDB
      const similarPatterns = await this.querySimilarPatterns(contractData);

      // Analizar relaciones causales en Neo4j
      const causalInsights = await this.analyzeCausalPatterns(contractData);

      // Ejecutar micro-simulaciones predictivas
      const simulations = await this.runMicroSimulations(contractData, similarPatterns, causalInsights);

      // Generar recomendaciones basadas en análisis
      const recommendations = await this.generateRecommendations(simulations, similarPatterns);

      // Determinar nivel de riesgo
      const riskLevel = this.calculateRiskLevel(simulations, causalInsights);

      return {
        riskLevel,
        recommendations,
        simulationResults: simulations,
        patternsAnalyzed: {
          similarPatterns: similarPatterns.length,
          causalInsights: causalInsights.length
        }
      };
    } catch (error) {
      console.error('Error generando pre-mortem:', error);
      // Fallback básico si falla la consulta a BD
      return {
        riskLevel: 'MEDIUM',
        recommendations: {
          general: 'Proceder con precaución adicional',
          specific: ['Implementar pruebas exhaustivas', 'Monitoreo continuo']
        },
        simulationResults: [],
        patternsAnalyzed: { similarPatterns: 0, causalInsights: 0 }
      };
    }
  }

  // Consultar patrones similares en ChromaDB
  async querySimilarPatterns(contractData) {
    try {
      const collection = await this.chroma.getOrCreateCollection({
        name: 'mission_patterns'
      });

      const queryText = `${contractData.title} ${contractData.description}`;
      const results = await collection.query({
        queryTexts: [queryText],
        nResults: 5
      });

      return results.documents || [];
    } catch (error) {
      console.error('Error consultando ChromaDB:', error);
      return [];
    }
  }

  // Analizar patrones causales en Neo4j
  async analyzeCausalPatterns(contractData) {
    const session = this.neo4jDriver.session();
    try {
      const result = await session.run(
        `
        MATCH (c:Contract)-[:HAS_RISK]->(r:Risk)
        WHERE c.title CONTAINS $keyword OR c.description CONTAINS $keyword
        RETURN r.type as riskType, r.severity as severity, count(*) as frequency
        ORDER BY frequency DESC
        LIMIT 10
        `,
        { keyword: contractData.title.split(' ')[0] } // Primera palabra como keyword
      );

      return result.records.map(record => ({
        riskType: record.get('riskType'),
        severity: record.get('severity'),
        frequency: record.get('frequency')
      }));
    } catch (error) {
      console.error('Error consultando Neo4j:', error);
      return [];
    } finally {
      await session.close();
    }
  }

  // Ejecutar micro-simulaciones predictivas
  async runMicroSimulations(contractData, patterns, insights) {
    const simulations = [];

    // Simular diferentes escenarios basados en patrones históricos
    for (let i = 0; i < Math.min(10, patterns.length + 1); i++) {
      const scenario = {
        id: `sim_${i}`,
        description: `Simulación ${i + 1}: ${this.generateScenarioDescription(contractData, i)}`,
        successProbability: this.calculateSuccessProbability(patterns, insights, i),
        estimatedDuration: this.estimateDuration(contractData, patterns),
        potentialRisks: this.identifyPotentialRisks(insights, i)
      };
      simulations.push(scenario);
    }

    return simulations;
  }

  // Generar descripción de escenario
  generateScenarioDescription(contractData, index) {
    const scenarios = [
      'Ejecución estándar sin complicaciones',
      'Retrasos menores en integración',
      'Problemas de compatibilidad detectados',
      'Rendimiento por debajo de lo esperado',
      'Fallos en pruebas de seguridad',
      'Dependencias externas problemáticas',
      'Cambios de requisitos durante ejecución',
      'Problemas de escalabilidad',
      'Conflictos con sistemas existentes',
      'Éxito con optimizaciones adicionales'
    ];
    return scenarios[index] || `Escenario ${index + 1} personalizado`;
  }

  // Calcular probabilidad de éxito
  calculateSuccessProbability(patterns, insights, index) {
    const baseProbability = 0.8;
    const patternPenalty = patterns.length * 0.02; // Más patrones similares = más riesgo
    const insightPenalty = insights.reduce((acc, insight) => acc + (insight.frequency * 0.01), 0);
    const randomFactor = (Math.random() - 0.5) * 0.2; // ±10% variación

    return Math.max(0.1, Math.min(0.95, baseProbability - patternPenalty - insightPenalty + randomFactor));
  }

  // Estimar duración
  estimateDuration(contractData, patterns) {
    const baseHours = contractData.description.length / 10; // Estimación simple
    const complexityMultiplier = patterns.length > 3 ? 1.5 : 1.0;
    return Math.ceil(baseHours * complexityMultiplier);
  }

  // Identificar riesgos potenciales
  identifyPotentialRisks(insights, index) {
    const commonRisks = [
      'Fallas de integración',
      'Problemas de rendimiento',
      'Vulnerabilidades de seguridad',
      'Incompatibilidades técnicas',
      'Retrasos en dependencias'
    ];

    return insights.slice(0, 3).map(insight => insight.riskType).concat(
      commonRisks.slice(0, 2)
    );
  }

  // Generar recomendaciones basadas en simulaciones
  async generateRecommendations(simulations, patterns) {
    const avgSuccessProb = simulations.reduce((acc, sim) => acc + sim.successProbability, 0) / simulations.length;
    const highRiskSims = simulations.filter(sim => sim.successProbability < 0.7);

    const recommendations = {
      general: avgSuccessProb > 0.8 ? 'Proyecto viable con bajo riesgo' : 'Requiere atención adicional',
      specific: []
    };

    if (highRiskSims.length > 0) {
      recommendations.specific.push('Implementar medidas de mitigación para escenarios de alto riesgo');
    }

    if (patterns.length > 3) {
      recommendations.specific.push('Revisar patrones históricos similares para lecciones aprendidas');
    }

    recommendations.specific.push('Mantener monitoreo continuo durante ejecución');
    recommendations.specific.push('Preparar planes de contingencia');

    return recommendations;
  }

  // Calcular nivel de riesgo general
  calculateRiskLevel(simulations, insights) {
    const avgSuccessProb = simulations.reduce((acc, sim) => acc + sim.successProbability, 0) / simulations.length;
    const highSeverityInsights = insights.filter(i => i.severity === 'HIGH').length;

    if (avgSuccessProb < 0.5 || highSeverityInsights > 2) {
      return 'CRITICAL';
    } else if (avgSuccessProb < 0.7 || highSeverityInsights > 0) {
      return 'HIGH';
    } else if (avgSuccessProb < 0.85) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }

  // Almacenar resultado de simulación en conciencia colectiva
  async storeSimulationResult(contractId, simulationData) {
    try {
      // Almacenar en ChromaDB como vector
      const collection = await this.chroma.getOrCreateCollection({
        name: 'simulation_results'
      });

      await collection.add({
        ids: [`sim_${contractId}_${Date.now()}`],
        documents: [JSON.stringify(simulationData)],
        metadatas: [{ contractId, type: 'simulation' }]
      });

      // Almacenar relaciones en Neo4j
      const session = this.neo4jDriver.session();
      await session.run(
        `
        MERGE (c:Contract {id: $contractId})
        MERGE (s:Simulation {id: $simId})
        MERGE (c)-[:HAS_SIMULATION]->(s)
        SET s.data = $data, s.timestamp = datetime()
        `,
        {
          contractId,
          simId: `sim_${contractId}_${Date.now()}`,
          data: JSON.stringify(simulationData)
        }
      );
      await session.close();

    } catch (error) {
      console.error('Error almacenando simulación:', error);
    }
  }
}
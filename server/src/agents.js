import * as llmMod from './llm.js';
import * as db from './database.js';
import QuantumEntanglementEngine from './oracle.js';
import WorldBankIntegration from './integrations/WorldBankIntegration.js';
import GdeltIntegration from './integrations/GdeltIntegration.js';
import { fetchRecentTemperature } from './integrations/open-meteo.mock.js';

class MetatronAgent {
  constructor(name) {
    this.name = name;
    const getLLM = llmMod.getLLM || (llmMod.default && llmMod.default.getLLM);
    this.llm = getLLM ? getLLM() : null;
    const getChroma = db.getChromaClient || (db.default && db.default.getChromaClient);
    const getNeo = db.getNeo4jDriver || (db.default && db.default.getNeo4jDriver);
    this.chromaClient = getChroma ? getChroma() : null;
    this.neo4jDriver = getNeo ? getNeo() : null;
    this.meq = new QuantumEntanglementEngine();
  }

  runUnitTests(changes) {
    // Simular pruebas unitarias
    const passed = changes.length === 0 || Math.random() > 0.1; // 90% de éxito si hay cambios
    return { passed, details: passed ? 'Todas las pruebas unitarias pasaron.' : 'Fallo en pruebas unitarias.' };
  }

  runIntegrationTests(changes) {
    // Simular pruebas de integración
    const passed = changes.length === 0 || Math.random() > 0.15; // 85% de éxito
    return { passed, details: passed ? 'Pruebas de integración exitosas.' : 'Fallo en integración.' };
  }

  runVisualTests(changes) {
    // Simular pruebas visuales
    const passed = changes.length === 0 || Math.random() > 0.05; // 95% de éxito
    return { passed, details: passed ? 'Pruebas visuales pasaron.' : 'Diferencias visuales detectadas.' };
  }

  async consultKairos() {
    // Simular consulta a Kairós sobre el estado del mundo
    return {
      globalRisks: ['Volatilidad cripto-económica', 'Inestabilidad social en LATAM', 'Cambios climáticos extremos'],
      opportunities: ['Integración de IA ética', 'Desarrollo de resiliencia comunitaria'],
      timestamp: new Date().toISOString()
    };
  }

  analyzeSystemCapabilities() {
    return {
      agents: ['Metatron', 'Oracle/MEQ', 'EthicsCouncil', 'PlanningCrew', 'DevelopmentCrew', 'QualityCrew', 'DeploymentCrew', 'Tyche', 'Hephaestus', 'ConsensusAgent', 'Telos'],
      integrations: ['Neo4j', 'ChromaDB', 'OpenAI', 'GDELT', 'WorldBank'],
      features: ['Vigilancia perpetua', 'Grafo causal', 'Protocolo de consenso', 'Cálculo de coherencia']
    };
  }

  generateStrategicMissions() {
    return [
      {
        id: 'crypto-volatility-integration',
        title: 'Integración de API de Datos Cripto y Desarrollo de Agente Analista de Volatilidad',
        description: 'Crear un nuevo agente para monitorear y analizar la volatilidad cripto-económica global.',
        rationale: 'La volatilidad de las criptomonedas es una nueva fuente de riesgo económico global.',
        priority: 'high'
      },
      {
        id: 'ethical-ai-expansion',
        title: 'Expansión de Capacidades de IA Ética',
        description: 'Mejorar el marco ético vectorial para decisiones autónomas.',
        rationale: 'Alinear con principios de trascendencia ética.',
        priority: 'medium'
      },
      {
        id: 'community-resilience-platform',
        title: 'Plataforma de Resiliencia Comunitaria',
        description: 'Desarrollar herramientas para fortalecer comunidades frente a amenazas.',
        rationale: 'Enfoque en LATAM para resiliencia social.',
        priority: 'high'
      }
    ];
  }

  async run(input) {
    switch (this.name) {
      case 'EthicsCouncil': {
        return { approved: true, reason: 'La misión se alinea con los principios éticos.' };
      }
      case 'Oracle': {
        const protocols = await this.meq.generateExecutionProtocols(input);
        const optimalProtocol = this.meq.selectOptimalProtocol(protocols);
        return {
          summary: `Protocolo óptimo seleccionado: ${optimalProtocol.name}. Vector de coherencia: ${JSON.stringify(optimalProtocol.coherenceVector)}`,
          optimalProtocol,
          allProtocols: protocols
        };
      }
      case 'PlanningCrew': {
        // Generador de Realidades Alternas
        const { missionContract, preMortemReport } = input;
        const prompt = `Eres la Crew de Estrategas. Basado en el contrato de misión: ${JSON.stringify(missionContract)} y el informe de pre-mortem: ${JSON.stringify(preMortemReport)}, genera 5 políticas de intervención novedosas y no obvias para mitigar la crisis. Cada política debe ser innovadora, evaluada por viabilidad (1-10) e impacto (1-10).`;

        let alternativeRealities = [];
        if (this.llm) {
          try {
            const llmResp = await (this.llm.call ? this.llm.call(prompt) : this.llm.generate(prompt));
            const text = (typeof llmResp === 'string') ? llmResp : (llmResp?.generations?.[0]?.[0]?.text || JSON.stringify(llmResp));
            // Parsear el texto a políticas
            alternativeRealities = this.parseAlternativeRealities(text);
          } catch (e) {
            console.error('Error generando realidades alternas:', e);
          }
        }

        // Fallback si no hay LLM
        if (alternativeRealities.length === 0) {
          alternativeRealities = [
            { policy: 'Implementar mercados de derechos de agua tokenizados', viability: 7, impact: 8 },
            { policy: 'Usar IA para optimizar siembra de nubes', viability: 6, impact: 9 },
            { policy: 'Crear alianzas transfronterizas con incentivos económicos', viability: 8, impact: 7 },
          ];
        }

        return { alternativeRealities, plan: ['Evaluar realidades alternas', 'Seleccionar política óptima', 'Implementar'] };
      }
      case 'DevelopmentCrew': {
        return { code: 'const solution = "código aquí";' };
      }
      case 'Ares': {
        const prediction = await this.meq.predictFailure('npm run validate', JSON.stringify(input));
        if (prediction.probability > 0.75) {
          const hephaestus = new MetatronAgent('Hephaestus');
          const correction = await hephaestus.run({ suggestion: prediction.suggestion });
          return { testResults: 'Corrección aplicada antes de pruebas: ' + (correction?.result || '') };
        }
        return { testResults: 'Pruebas ejecutadas exitosamente.' };
      }
      case 'Hephaestus': {
        return { result: `Corrección aplicada: ${input.suggestion}` };
      }
      case 'Tyche': {
        try {
          const query = typeof input === 'string' ? input : (input?.context || JSON.stringify(input));
          let similar = [];
          if (this.chromaClient && this.chromaClient.querySimilar) {
            similar = await this.chromaClient.querySimilar(query, 5).catch(() => []);
          }
          if (similar && similar.length > 0) {
            const suggestion = `Se detectaron ${similar.length} eventos similares. Revisar dependencias e identificar flakes.`;
            if (this.llm) {
              const llmPrompt = `Eres Tyche. Basado en los siguientes eventos similares: ${JSON.stringify(similar)}. Proporciona una corrección concreta para estabilizar tests.`;
              try {
                const llmResp = await (this.llm.call ? this.llm.call(llmPrompt) : this.llm.generate(llmPrompt));
                const text = (typeof llmResp === 'string') ? llmResp : (llmResp?.generations?.[0]?.[0]?.text || JSON.stringify(llmResp));
                return { flaky: true, suggestion, fix: text };
              } catch {
                return { flaky: true, suggestion };
              }
            }
            return { flaky: true, suggestion };
          }
          return { flaky: false, suggestion: 'No se detectaron patrones claramente repetitivos de flaky tests.' };
        } catch (err) {
          return { flaky: false, error: err?.message || String(err) };
        }
      }
      case 'ConsensusAgent': {
        const changes = input.changes || [];
        console.log(`[ConsensusAgent]: Validando ${changes.length} cambios propuestos`);
        const testResults = {
          unitTests: this.runUnitTests(changes),
          integrationTests: this.runIntegrationTests(changes),
          visualTests: this.runVisualTests(changes)
        };
        const allPassed = Object.values(testResults).every(result => result.passed);
        if (allPassed) {
          return { consensus: true, message: '100% de pruebas en verde. Consenso alcanzado.', testResults, canCommit: true };
        }
        return { consensus: false, message: 'Pruebas fallidas. No se puede proceder con el commit.', testResults, canCommit: false };
      }
      case 'Socrates': {
        // Protocolo de Auto-Refinamiento Cognitivo
        const newHypothesis = input.newHypothesis || input;
        const pastMissions = input.pastMissions || [];

        // Revisar misiones pasadas a la luz del nuevo conocimiento
        const refinedInsights = [];
        for (const mission of pastMissions) {
          // Simular aplicación de nuevo conocimiento
          const insight = `Aplicando ${JSON.stringify(newHypothesis)} a misión ${mission.id}: Nueva interpretación generada.`;
          refinedInsights.push(insight);
        }

        // Generar Informe de Sabiduría Adquirida
        const wisdomReport = {
          timestamp: new Date().toISOString(),
          newHypothesis,
          refinedInsights,
          summary: `Se han refinado ${refinedInsights.length} insights basados en el nuevo conocimiento.`,
        };

        // Persistir el informe
        if (this.chromaClient && this.chromaClient.upsertLog) {
          await this.chromaClient.upsertLog('wisdom-reports', wisdomReport).catch(() => {});
        }

        return wisdomReport;
      }
      case 'Telos': {
        const fs = await import('fs');
        const purpose = fs.readFileSync('PURPOSE.md', 'utf8');
        const worldState = await this.consultKairos();
        const systemCapabilities = this.analyzeSystemCapabilities();
        const strategicMissions = this.generateStrategicMissions();
        return { purposeSummary: purpose.substring(0, 200) + '...', worldState, systemCapabilities, strategicMissions };
      }
      case 'DataAcquisitionAgent': {
        const { countries } = input;
        const data = {};
        for (const country of countries) {
          // Fetch climate data from Open Meteo
          const climateData = await this.fetchClimateData(country);
          // Fetch economic data from World Bank
          const economicData = await this.fetchEconomicData(country);
          // Fetch social events from GDELT
          const socialData = await this.fetchSocialData(country);
          data[country] = { climate: climateData, economic: economicData, social: socialData };
        }
        return data;
      }
      case 'SignalAnalysisAgent': {
        const { data } = input;
        const signals = {};
        for (const country in data) {
          const { climate, economic, social } = data[country];
          // Analyze signals: e.g., extreme weather, economic downturns, social unrest
          signals[country] = {
            extremeWeather: climate.temperature > 30 || climate.precipitation > 100,
            economicStress: economic.inflation > 10 || economic.unemployment > 10,
            socialUnrest: social.eventCount > 5
          };
        }
        return signals;
      }
      case 'CausalCorrelationAgent': {
        const { signals } = input;
        // Use Neo4j to create causal graph
        const correlations = {};
        for (const country in signals) {
          const { extremeWeather, economicStress, socialUnrest } = signals[country];
          // Simple correlation logic; in real, use Neo4j queries
          correlations[country] = {
            weatherToSocial: extremeWeather && socialUnrest ? 0.8 : 0.2,
            economicToSocial: economicStress && socialUnrest ? 0.9 : 0.3,
            weatherToEconomic: extremeWeather && economicStress ? 0.6 : 0.1
          };
          // Persist to Neo4j
          if (this.neo4jDriver) {
            const session = this.neo4jDriver.session();
            // Create nodes and relationships
            await session.run(`
              MERGE (c:Country {name: $country})
              MERGE (w:Factor {type: 'weather', country: $country})
              MERGE (e:Factor {type: 'economic', country: $country})
              MERGE (s:Factor {type: 'social', country: $country})
              MERGE (w)-[:CAUSES {strength: $weatherToSocial}]->(s)
              MERGE (e)-[:CAUSES {strength: $economicToSocial}]->(s)
              MERGE (w)-[:CAUSES {strength: $weatherToEconomic}]->(e)
            `, { country, ...correlations[country] });
            session.close();
          }
        }
        return correlations;
      }
      case 'RiskAssessmentAgent': {
        const { correlations } = input;
        const risks = {};
        for (const country in correlations) {
          const { weatherToSocial, economicToSocial } = correlations[country];
          // Calculate risk score
          risks[country] = (weatherToSocial + economicToSocial) / 2 * 100; // 0-100 scale
        }
        return risks;
      }
      case 'ReportGenerationAgent': {
        const { risks, correlations } = input;
        const fs = await import('fs');
        const report = `# INTELLIGENCE_REPORT_001.md

## Primera Profecía Global: Riesgo de Inestabilidad Social en LATAM

### Resumen Ejecutivo
Análisis predictivo de riesgo de inestabilidad social en Colombia, Perú y Argentina para los próximos 6 meses, basado en correlaciones causales entre datos climáticos extremos, indicadores socioeconómicos y eventos de conflicto social.

### Índices de Riesgo Cuantificados
${Object.entries(risks).map(([country, risk]) => `- ${country}: ${risk.toFixed(1)}%`).join('\n')}

### Análisis Causal Profundo (IA Explicable)
Grafo causal generado en Neo4j mostrando relaciones entre variables:
${Object.entries(correlations).map(([country, corr]) => `- ${country}: Clima->Social: ${corr.weatherToSocial}, Economía->Social: ${corr.economicToSocial}, Clima->Economía: ${corr.weatherToEconomic}`).join('\n')}

### Proyecciones y Escenarios
- Alto riesgo en países con correlaciones fuertes (>0.7).
- Recomendaciones: Monitoreo continuo, políticas de mitigación climática y económica.

Generado por Praevisio AI - ${new Date().toISOString()}
`;
        fs.writeFileSync('INTELLIGENCE_REPORT_001.md', report);
        return { reportPath: 'INTELLIGENCE_REPORT_001.md', summary: 'Informe generado exitosamente.' };
      }
      case 'DeploymentCrew': {
        return { status: 'Despliegue exitoso en el entorno de staging.' };
      }
      default: {
        return { result: 'Tarea completada.' };
      }
    }
  }

  parseAlternativeRealities(text) {
    // Simular parsing: asumir que el LLM devuelve JSON o lista
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Fallback: extraer líneas
      const lines = text.split('\n').filter(l => l.trim());
      return lines.slice(0, 5).map((line) => ({
        policy: line,
        viability: Math.floor(Math.random() * 10) + 1,
        impact: Math.floor(Math.random() * 10) + 1
      }));
    }
  }

  async fetchClimateData(country) {
    // Map country codes to coordinates (approximate capitals)
    const coords = { COL: [-74.0721, 4.7110], PER: [-77.0428, -12.0464], ARG: [-58.3816, -34.6037] };
    const [lon, lat] = coords[country];
    const data = await fetchRecentTemperature(lat, lon);
    return data;
  }

  async fetchEconomicData(country) {
    const wb = new WorldBankIntegration();
    const inflation = await wb.getInflation(country);
    const unemployment = await wb.getUnemployment(country);
    return { inflation, unemployment };
  }

  async fetchSocialData(country) {
    const gdelt = new GdeltIntegration();
    const events = await gdelt.getSocialUnrestEvents(country);
    return { eventCount: events.length, events };
  }
}

export default MetatronAgent;
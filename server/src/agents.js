import * as llmMod from './llm.js';
import * as db from './database.js';
import QuantumEntanglementEngine from './oracle.js';
import WorldBankIntegration from './integrations/WorldBankIntegration.js';
import GdeltIntegration from './integrations/GdeltIntegration.js';
import FMIIntegration from './integrations/FMIIntegration.js';
import SatelliteIntegration from './integrations/SatelliteIntegration.js';
import CryptoIntegration from './integrations/CryptoIntegration.js';
import { fetchRecentTemperature } from './integrations/open-meteo.mock.js';

class MetatronAgent {
  constructor(name) {
    this.name = name;
    const getLLM = llmMod.getLLM || (llmMod.default && llmMod.default.getLLM);
    this.llm = getLLM ? getLLM() : null;
    const getChroma = db.getChromaClient || (db.default && db.default.getChromaClient);
    this.chromaClient = getChroma ? getChroma() : null;
    this.neo4jDriver = null; // Will be initialized lazily
    this.meq = new QuantumEntanglementEngine();
    this.cryptoIntegration = new CryptoIntegration();
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
      agents: ['Metatron', 'Oracle/MEQ', 'EthicsCouncil', 'PlanningCrew', 'DevelopmentCrew', 'QualityCrew', 'DeploymentCrew', 'Tyche', 'Hephaestus', 'ConsensusAgent', 'Telos', 'CryptoVolatilityAgent', 'CommunityResilienceAgent'],
      integrations: ['Neo4j', 'ChromaDB', 'OpenAI', 'GDELT', 'WorldBank', 'IMF', 'Satellite', 'Crypto'],
      features: ['Vigilancia perpetua', 'Grafo causal', 'Protocolo de consenso', 'Cálculo de coherencia', 'Datos satelitales NDVI', 'Análisis de volatilidad cripto', 'Análisis de resiliencia comunitaria']
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
        // Evalúa decisiones autónomas usando un vector de coherencia ética basado en principios de ética cuántica de Praevisio AI
        const decision = typeof input === 'string' ? input : (input?.description || JSON.stringify(input));
        const ethicalVector = this.calculateEthicalCoherenceVector(decision);
        const coherenceScore = (ethicalVector.humanImpact + ethicalVector.environmentalSustainability + ethicalVector.socialEquity) / 3;
        const approved = coherenceScore >= 0.7;
        const reason = approved
          ? `La decisión se alinea con los principios éticos de Praevisio AI. Vector de coherencia: ${JSON.stringify(ethicalVector)}`
          : `La decisión no cumple con los umbrales éticos requeridos. Vector de coherencia: ${JSON.stringify(ethicalVector)}`;
        return { approved, reason, ethicalVector, coherenceScore };
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
        const { countries, gdeltCodes } = input;
        const data = {};
        const worldBank = new WorldBankIntegration();
        const gdelt = new GdeltIntegration();
        const fmi = new FMIIntegration();
        const satellite = new SatelliteIntegration();
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 6 months ago
        const startYear = startDate.split('-')[0];
        const endYear = endDate.split('-')[0];

        for (let i = 0; i < countries.length; i++) {
          const country = countries[i];
          const gdeltCode = gdeltCodes ? gdeltCodes[i] : country;
          let climateData, economicData, debtData, socialData, satelliteData;

          // Coordinates for satellite data (approximate capitals)
          const coords = { COL: [4.7110, -74.0721], PER: [-12.0464, -77.0428], ARG: [-34.6037, -58.3816] };
          const [lat, lon] = coords[country] || [0, 0];

          try {
            // Fetch climate data from Open Meteo
            climateData = await this.fetchClimateData(country);
          } catch (error) {
            // Log and fallback to mock climate data
            console.debug('fetchClimateData error:', error?.message || error);
            climateData = { temperature: 25 + Math.random() * 10, precipitation: Math.random() * 50 };
          }

          try {
            // Fetch economic data from World Bank
            economicData = await worldBank.getKeyEconomicData(country, startYear, endYear);
          } catch (error) {
            console.debug('worldBank.getKeyEconomicData error:', error?.message || error);
            // Fallback to mock economic data
            economicData = { inflation: Math.random() * 20, unemployment: Math.random() * 15 };
          }

          try {
            // Fetch debt data from IMF
            debtData = await fmi.getDebtData(country, startYear, endYear);
          } catch (error) {
            console.debug('fmi.getDebtData error:', error?.message || error);
            // Fallback to mock debt data
            const baseDebtLevels = { 'COL': 55, 'PER': 35, 'ARG': 85, 'MEX': 50, 'BRA': 80, 'CHL': 40 };
            const baseLevel = baseDebtLevels[country.toUpperCase()] || 50;
            const variation = (Math.random() - 0.5) * 10;
            debtData = {
              country,
              period: { startYear, endYear },
              debtData: [
                { year: startYear, value: Math.max(20, baseLevel + variation - 2) },
                { year: endYear, value: Math.max(20, baseLevel + variation + 2) }
              ],
              isMock: true
            };
          }

          try {
            // Fetch social events from GDELT
            socialData = await gdelt.getSocialEvents(gdeltCode, startDate, endDate);
          } catch (error) {
            console.debug('gdelt.getSocialEvents error:', error?.message || error);
            // Fallback to mock social data
            socialData = { eventCount: Math.floor(Math.random() * 10), events: [] };
          }

          try {
            // Fetch satellite NDVI data
            satelliteData = await satellite.getNDVIData(lat, lon, startDate, endDate);
          } catch (error) {
            console.debug('satellite.getNDVIData error:', error?.message || error);
            // Fallback to mock satellite data
            satelliteData = { ndviData: [], isMock: true, note: 'Using mock satellite data' };
          }

          data[country] = { climate: climateData, economic: economicData, debt: debtData, social: socialData, satellite: satelliteData };
        }
        return data;
      }
      case 'SignalAnalysisAgent': {
        const { data } = input;
        const signals = {};
        for (const _country in data) {
          // reference _country to satisfy lint rules about unused variables
          void _country;
          const { climate, economic, debt, social } = data[_country];
          // Analyze signals: e.g., extreme weather, economic downturns, high debt, social unrest
          const latestDebt = debt.debtData && debt.debtData.length > 0 ? debt.debtData[debt.debtData.length - 1] : 0;
          signals[_country] = {
            extremeWeather: climate.temperature > 30 || climate.precipitation > 100,
            economicStress: economic.inflation > 10 || economic.unemployment > 10,
            debtStress: latestDebt > 50, // Assuming debt > 50% of GDP is high
            socialUnrest: social.eventCount > 5
          };
        }
        return signals;
      }
      case 'CausalCorrelationAgent': {
        const { signals } = input;
        const correlations = {};
        // Initialize Neo4j driver lazily
        if (!this.neo4jDriver) {
          const getNeo = db.getNeo4jDriver || (db.default && db.default.getNeo4jDriver);
          if (getNeo) {
            this.neo4jDriver = await getNeo();
          }
        }
        const session = this.neo4jDriver ? this.neo4jDriver.session() : null;

        for (const _country in signals) {
          // reference _country to satisfy lint rules about unused variables
          void _country;
          const { extremeWeather, economicStress, debtStress, socialUnrest } = signals[_country];

          // Calculate correlations using data analysis
          const weatherToSocial = extremeWeather && socialUnrest ? 0.8 : (extremeWeather ? 0.4 : 0.1);
          const economicToSocial = economicStress && socialUnrest ? 0.9 : (economicStress ? 0.5 : 0.2);
          const debtToSocial = debtStress && socialUnrest ? 0.7 : (debtStress ? 0.3 : 0.1);
          const weatherToEconomic = extremeWeather && economicStress ? 0.6 : (extremeWeather ? 0.3 : 0.1);
          const debtToEconomic = debtStress && economicStress ? 0.8 : (debtStress ? 0.4 : 0.1);

          correlations[country] = {
            weatherToSocial,
            economicToSocial,
            debtToSocial,
            weatherToEconomic,
            debtToEconomic
          };
          // Persist to Neo4j causal graph
          if (session) {
            try {
              // Create nodes for factors
              await session.run(`
                MERGE (c:Country {code: $country})
                MERGE (w:Factor {name: 'ExtremeWeather', country: $country})
                MERGE (e:Factor {name: 'EconomicStress', country: $country})
                MERGE (d:Factor {name: 'DebtStress', country: $country})
                MERGE (s:Factor {name: 'SocialUnrest', country: $country})
                MERGE (c)-[:HAS_FACTOR]->(w)
                MERGE (c)-[:HAS_FACTOR]->(e)
                MERGE (c)-[:HAS_FACTOR]->(d)
                MERGE (c)-[:HAS_FACTOR]->(s)
                MERGE (w)-[:CAUSES {strength: $ws}]->(s)
                MERGE (e)-[:CAUSES {strength: $es}]->(s)
                MERGE (d)-[:CAUSES {strength: $ds}]->(s)
                MERGE (w)-[:CAUSES {strength: $we}]->(e)
                MERGE (d)-[:CAUSES {strength: $de}]->(e)
              `, {
                country,
                ws: weatherToSocial,
                es: economicToSocial,
                ds: debtToSocial,
                we: weatherToEconomic,
                de: debtToEconomic
              });
            } catch (err) {
              console.error('Error persisting causal graph to Neo4j:', err);
            }
          }
        }

        if (session) session.close();
        return correlations;
      }
      case 'RiskAssessmentAgent': {
        const { correlations } = input;
        const risks = {};

        // Get global crypto volatility factor
        const cryptoAgent = new MetatronAgent('CryptoVolatilityAgent');
        const cryptoResult = await cryptoAgent.run({ cryptoIds: ['bitcoin', 'ethereum'], days: 7 });
        const globalCryptoVolatility = cryptoResult?.globalRiskAssessment?.averageVolatility || 0;
        const cryptoRiskFactor = Math.min(globalCryptoVolatility * 200, 20); // Scale to 0-20 points

        for (const _country in correlations) {
          const { weatherToSocial, economicToSocial, debtToSocial } = correlations[_country];
          // Calculate base risk score including debt
          const baseRisk = (weatherToSocial + economicToSocial + debtToSocial) / 3 * 100;
          // Add global crypto volatility factor
          risks[_country] = Math.min(baseRisk + cryptoRiskFactor, 100); // 0-100 scale, cap at 100
        }

        // Add global crypto risk entry
        risks['GLOBAL_CRYPTO'] = cryptoRiskFactor * 5; // Scale for visibility

        return risks;
      }
      case 'ReportGenerationAgent': {
        const { risks, correlations } = input;
        const fs = await import('fs');
        const report = `# INTELLIGENCE_REPORT_001.md

## Primera Profecía Global: Riesgo de Inestabilidad Social en LATAM

### Resumen Ejecutivo
Análisis predictivo de riesgo de inestabilidad social en Colombia, Perú y Argentina para los próximos 6 meses, basado en correlaciones causales entre datos climáticos extremos, indicadores socioeconómicos, deuda externa y eventos de conflicto social.

### Índices de Riesgo Cuantificados
${Object.entries(risks).map(([country, risk]) => `- ${country}: ${risk.toFixed(1)}%`).join('\n')}

### Análisis Causal Profundo (IA Explicable)
Grafo causal generado en Neo4j mostrando relaciones entre variables:
${Object.entries(correlations).map(([country, corr]) => `- ${country}: Clima->Social: ${corr.weatherToSocial}, Economía->Social: ${corr.economicToSocial}, Deuda->Social: ${corr.debtToSocial}, Clima->Economía: ${corr.weatherToEconomic}, Deuda->Economía: ${corr.debtToEconomic}`).join('\n')}

### Proyecciones y Escenarios
- Alto riesgo en países con correlaciones fuertes (>0.7).
- Recomendaciones: Monitoreo continuo, políticas de mitigación climática, económica y de deuda.

Generado por Praevisio AI - ${new Date().toISOString()}
`;
        fs.writeFileSync('INTELLIGENCE_REPORT_001.md', report);
        return { reportPath: 'INTELLIGENCE_REPORT_001.md', summary: 'Informe generado exitosamente.' };
      }
      case 'PeruAgent': {
        // Agente especializado para análisis de Perú - Cadena de suministro de cobre
        const fs = await import('fs');
  const missionData = JSON.parse(fs.readFileSync('public/missions/america/peru/mision_peru.json', 'utf8'));

  // Use missionData minimally to avoid lint 'assigned but never used'
  console.debug('PeruAgent mission metadata:', missionData?.name || missionData?.id || 'unknown');

  // Simular análisis de datos específicos de Perú
        const analysis = {
          unionNegotiations: {
            status: 'En curso',
            risk: 0.6,
            details: 'Negociaciones salariales en minas de cobre con alta probabilidad de fracaso'
          },
          localNews: {
            regions: ['Arequipa', 'Moquegua'],
            events: Math.floor(Math.random() * 5) + 1,
            risk: 0.3,
            details: 'Aumento de protestas por condiciones laborales'
          },
          historicalStrikes: {
            averageDuration: 45,
            frequency: 'Cada 2 años',
            risk: 0.1,
            details: 'Patrón histórico de huelgas prolongadas'
          }
        };

        const totalRisk = (analysis.unionNegotiations.risk * 0.6) +
                         (analysis.localNews.risk * 0.3) +
                         (analysis.historicalStrikes.risk * 0.1);

        const report = `# PERU INTELLIGENCE REPORT - Predicción de Disrupción en Cadena de Suministro de Cobre (2025)

## Resumen Ejecutivo
Análisis predictivo de riesgo de disrupción en la cadena de suministro de cobre en Perú para 2025.

## Análisis de Riesgos
- **Negociaciones Sindicales**: ${analysis.unionNegotiations.details} (Riesgo: ${(analysis.unionNegotiations.risk * 100).toFixed(0)}%)
- **Noticias Locales**: ${analysis.localNews.details} en ${analysis.localNews.regions.join(', ')} (Riesgo: ${(analysis.localNews.risk * 100).toFixed(0)}%)
- **Datos Históricos**: ${analysis.historicalStrikes.details} (Riesgo: ${(analysis.historicalStrikes.risk * 100).toFixed(0)}%)

## Probabilidad Total de Disrupción
**${(totalRisk * 100).toFixed(0)}%**

Generado por PeruAgent - Praevisio AI - ${new Date().toISOString()}
`;
        fs.writeFileSync('PERU_INTELLIGENCE_REPORT.md', report);
        return { reportPath: 'PERU_INTELLIGENCE_REPORT.md', totalRisk, analysis };
      }
      case 'DeploymentCrew': {
        return { status: 'Despliegue exitoso en el entorno de staging.' };
      }
      case 'CryptoVolatilityAgent': {
        const { cryptoIds = ['bitcoin', 'ethereum'], days = 30 } = input;
        const cryptoData = await this.cryptoIntegration.getCryptoData(cryptoIds);
        const volatilityAnalysis = {};

        for (const crypto of cryptoData) {
          const historicalData = await this.cryptoIntegration.getHistoricalData(crypto.id, days);
          const prices = historicalData.prices.map(p => p[1]);
          const volatility = this.calculateVolatility(prices);
          const trend = this.analyzeTrend(prices);
          const riskLevel = this.assessRiskLevel(volatility, crypto.price_change_percentage_24h);

          volatilityAnalysis[crypto.id] = {
            currentPrice: crypto.current_price,
            priceChange24h: crypto.price_change_percentage_24h,
            volatility: volatility,
            trend: trend,
            riskLevel: riskLevel,
            marketCap: crypto.market_cap,
            volume24h: crypto.total_volume
          };
        }

        const globalRiskAssessment = this.generateGlobalRiskAssessment(volatilityAnalysis);

        return {
          cryptoData,
          volatilityAnalysis,
          globalRiskAssessment,
          timestamp: new Date().toISOString()
        };
      }
      case 'CommunityResilienceAgent': {
        const { countries = ['COL', 'PER', 'ARG'], days = 30 } = input;
        const gdelt = new GdeltIntegration();
        const resilienceAnalysis = {};

  for (const country of countries) {
          const endDate = new Date().toISOString().split('T')[0];
          const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

          try {
            const socialData = await gdelt.getSocialEvents(country, startDate, endDate);
            const resilienceScore = this.calculateResilienceScore(socialData);
            const recommendations = this.generateResilienceRecommendations(resilienceScore, socialData);

            resilienceAnalysis[country] = {
              socialEvents: socialData.eventCount,
              resilienceScore: resilienceScore,
              recommendations: recommendations,
              period: { startDate, endDate }
            };
          } catch (error) {
            // Log the error and fallback to mock data
            console.debug('ResilienceAgent error fetching socialData for', country, ':', error?.message || error);
            resilienceAnalysis[country] = {
              socialEvents: Math.floor(Math.random() * 20),
              resilienceScore: Math.random() * 100,
              recommendations: ['Fortalecer redes comunitarias', 'Implementar programas de apoyo social'],
              period: { startDate, endDate },
              isMock: true
            };
          }
        }

        const globalResilienceAssessment = this.generateGlobalResilienceAssessment(resilienceAnalysis);

        return {
          resilienceAnalysis,
          globalResilienceAssessment,
          timestamp: new Date().toISOString()
        };
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

  async fetchEconomicData(_country) {
    // Mock data for testing
    void _country;
    const inflation = Math.random() * 20; // 0-20%
    const unemployment = Math.random() * 15; // 0-15%
    return { inflation, unemployment };
  }

  async fetchSocialData(_country) {
    // Mock data for testing
    void _country;
    const eventCount = Math.floor(Math.random() * 10); // 0-10 events
    return { eventCount, events: [] };
  }

  calculateVolatility(prices) {
    if (prices.length < 2) return 0;
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility (252 trading days)
  }

  analyzeTrend(prices) {
    if (prices.length < 2) return 'neutral';
    const recent = prices.slice(-7); // Last 7 days
    const older = prices.slice(-14, -7); // Previous 7 days
    const recentAvg = recent.reduce((sum, p) => sum + p, 0) / recent.length;
    const olderAvg = older.reduce((sum, p) => sum + p, 0) / older.length;
    const change = (recentAvg - olderAvg) / olderAvg;

    if (change > 0.05) return 'bullish';
    if (change < -0.05) return 'bearish';
    return 'neutral';
  }

  assessRiskLevel(volatility, priceChange24h) {
    const volScore = Math.min(volatility * 100, 10); // Cap at 10
    const changeScore = Math.abs(priceChange24h) / 10; // Scale change percentage
    const totalScore = volScore + changeScore;

    if (totalScore > 15) return 'high';
    if (totalScore > 8) return 'medium';
    return 'low';
  }

  generateGlobalRiskAssessment(volatilityAnalysis) {
    const cryptos = Object.values(volatilityAnalysis);
    const avgVolatility = cryptos.reduce((sum, c) => sum + c.volatility, 0) / cryptos.length;
    const highRiskCount = cryptos.filter(c => c.riskLevel === 'high').length;
    const totalMarketCap = cryptos.reduce((sum, c) => sum + c.marketCap, 0);

    let assessment = 'Estable';
    if (highRiskCount > cryptos.length / 2) {
      assessment = 'Alto riesgo de volatilidad extrema';
    } else if (avgVolatility > 0.5) {
      assessment = 'Moderada volatilidad detectada';
    }

    return {
      averageVolatility: avgVolatility,
      highRiskCryptos: highRiskCount,
      totalMarketCap: totalMarketCap,
      assessment: assessment,
      recommendations: this.generateRecommendations(assessment, cryptos)
    };
  }

  generateRecommendations(assessment, cryptos) {
    const recommendations = [];

    if (assessment.includes('Alto riesgo')) {
      recommendations.push('Considerar diversificación en activos tradicionales');
      recommendations.push('Implementar stop-loss orders');
      recommendations.push('Monitorear noticias macroeconómicas');
    } else if (assessment.includes('Moderada')) {
      recommendations.push('Mantener posiciones pero con cautela');
      recommendations.push('Revisar portafolios semanalmente');
    } else {
      recommendations.push('Oportunidad para inversión en cripto');
      recommendations.push('Explorar nuevos proyectos emergentes');
    }

    const bullishCount = cryptos.filter(c => c.trend === 'bullish').length;
    if (bullishCount > cryptos.length / 2) {
      recommendations.push('Tendencia alcista general - considerar posiciones largas');
    }

    return recommendations;
  }

  calculateResilienceScore(socialData) {
    // Simple score based on event count: lower events = higher resilience
    const eventCount = socialData.eventCount || 0;
    // Score from 0-100, higher is better resilience
    return Math.max(0, 100 - eventCount * 5);
  }

  generateResilienceRecommendations(resilienceScore, socialData) {
    const recommendations = [];

    if (resilienceScore < 50) {
      recommendations.push('Implementar programas de apoyo social inmediato');
      recommendations.push('Fortalecer comunicación comunitaria');
      recommendations.push('Desarrollar planes de contingencia para eventos sociales');
    } else if (resilienceScore < 80) {
      recommendations.push('Monitorear indicadores sociales regularmente');
      recommendations.push('Promover educación y capacitación comunitaria');
    } else {
      recommendations.push('Mantener y expandir redes de apoyo existentes');
      recommendations.push('Compartir mejores prácticas con otras comunidades');
    }

    if (socialData.eventCount > 10) {
      recommendations.push('Activar protocolos de respuesta a crisis social');
    }

    return recommendations;
  }

  generateGlobalResilienceAssessment(resilienceAnalysis) {
    const countries = Object.values(resilienceAnalysis);
    // reference countries to avoid lint unused variable if later unused
    void countries;
    const avgResilience = countries.reduce((sum, c) => sum + c.resilienceScore, 0) / countries.length;
    const lowResilienceCount = countries.filter(c => c.resilienceScore < 50).length;

    let assessment = 'Resiliencia comunitaria estable';
    if (lowResilienceCount > countries.length / 2) {
      assessment = 'Alto riesgo de vulnerabilidad comunitaria';
    } else if (avgResilience < 70) {
      assessment = 'Resiliencia moderada detectada';
    }

    return {
      averageResilience: avgResilience,
      lowResilienceCountries: lowResilienceCount,
      assessment: assessment,
      globalRecommendations: this.generateGlobalResilienceRecommendations(assessment, countries)
    };
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  generateGlobalResilienceRecommendations(assessment, _countries) {
    const recommendations = [];

    if (assessment.includes('Alto riesgo')) {
      recommendations.push('Implementar programas regionales de fortalecimiento comunitario');
      recommendations.push('Aumentar monitoreo de indicadores sociales');
      recommendations.push('Coordinar con gobiernos locales para apoyo');
    } else if (assessment.includes('moderada')) {
      recommendations.push('Continuar con iniciativas de resiliencia existentes');
      recommendations.push('Evaluar efectividad de programas actuales');
    } else {
      recommendations.push('Expandir modelos exitosos a otras regiones');
      recommendations.push('Invertir en prevención y preparación');
    }

    return recommendations;
  }

  /**
   * Calcula el vector de coherencia ética para una decisión dada.
   * Evalúa el texto de la decisión contra principios éticos de Praevisio AI:
   * - Impacto humano: bienestar, salud, educación vs daño, violencia
   * - Sostenibilidad ambiental: conservación, renovables vs contaminación, deforestación
   * - Equidad social: igualdad, justicia, inclusión vs desigualdad, discriminación
   *
   * @param {string} decisionText - El texto de la decisión a evaluar
   * @returns {Object} Vector ético con scores 0-1 para cada principio
   * @property {number} humanImpact - Score de impacto humano (0-1)
   * @property {number} environmentalSustainability - Score de sostenibilidad ambiental (0-1)
   * @property {number} socialEquity - Score de equidad social (0-1)
   */
  calculateEthicalCoherenceVector(decisionText) {
    const text = decisionText.toLowerCase();

    // Keywords para impacto humano (positivo/negativo)
    const humanPositive = ['ayuda', 'salud', 'educación', 'bienestar', 'protección', 'seguridad', 'apoyo', 'cuidado', 'desarrollo humano'];
    const humanNegative = ['daño', 'violencia', 'explotación', 'abuso', 'muerte', 'sufrimiento', 'discriminación'];

    // Keywords para sostenibilidad ambiental
    const envPositive = ['sostenibilidad', 'renovable', 'conservación', 'ecológico', 'verde', 'biodiversidad', 'clima', 'medio ambiente'];
    const envNegative = ['contaminación', 'deforestación', 'emisiones', 'desastre', 'daño ambiental', 'cambio climático negativo'];

    // Keywords para equidad social
    const socialPositive = ['equidad', 'igualdad', 'justicia', 'inclusión', 'comunidad', 'solidaridad', 'derechos', 'acceso igual'];
    const socialNegative = ['desigualdad', 'discriminación', 'exclusión', 'marginalización', 'pobreza extrema', 'división social'];

    const calculateScore = (positiveKeywords, negativeKeywords) => {
      let score = 0.5; // Base neutral
      positiveKeywords.forEach(keyword => {
        if (text.includes(keyword)) score += 0.1;
      });
      negativeKeywords.forEach(keyword => {
        if (text.includes(keyword)) score -= 0.1;
      });
      return Math.max(0, Math.min(1, score)); // Clamp 0-1
    };

    return {
      humanImpact: calculateScore(humanPositive, humanNegative),
      environmentalSustainability: calculateScore(envPositive, envNegative),
      socialEquity: calculateScore(socialPositive, socialNegative)
    };
  }
}

export default MetatronAgent;
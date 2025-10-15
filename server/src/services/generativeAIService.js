/**
 * @fileoverview Generative AI Service for Praevisio AI.
 * This service integrates generative AI capabilities to provide narrative analysis
 * and contextual explanations for risk predictions.
 */

import axios from 'axios';

// Configuration for generative AI providers
const GENERATIVE_AI_CONFIG = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    maxTokens: 1000,
    temperature: 0.7,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: 'https://api.anthropic.com/v1',
    model: 'claude-3-haiku-20240307',
    maxTokens: 1000,
    temperature: 0.7,
  },
  // Fallback to mock responses if no API keys are available
  mock: {
    enabled: true,
    responseDelay: 500, // ms
  },
};

// Current active provider (can be switched based on availability/performance)
let activeProvider = 'openai';

/**
 * Switches to the next available generative AI provider.
 * @returns {string} The new active provider.
 */
function switchProvider() {
  const providers = Object.keys(GENERATIVE_AI_CONFIG).filter(p => p !== 'mock');
  const currentIndex = providers.indexOf(activeProvider);
  const nextIndex = (currentIndex + 1) % providers.length;
  activeProvider = providers[nextIndex];
  console.log(`[GenerativeAIService] Switched to provider: ${activeProvider}`);
  return activeProvider;
}

/**
 * Generates a predictive narrative based on risk indices and data patterns.
 * @param {object} riskData - Current risk indices and related data.
 * @param {object} options - Options for narrative generation.
 * @returns {Promise<object>} Generated narrative with analysis and scenarios.
 */
async function generatePredictiveNarrative(riskData, options = {}) {
  const {
    focusAreas = ['climate', 'economic', 'social'],
    timeHorizon = '6months',
    detailLevel = 'comprehensive',
    language = 'es',
  } = options;

  const prompt = buildNarrativePrompt(riskData, { focusAreas, timeHorizon, detailLevel, language });

  try {
    const response = await callGenerativeAPI(prompt);
    return parseNarrativeResponse(response);
  } catch (error) {
    console.warn(`[GenerativeAIService] Error generating narrative with ${activeProvider}:`, error.message);

    // Try switching provider
    if (activeProvider !== 'mock') {
      switchProvider();
      try {
        const response = await callGenerativeAPI(prompt);
        return parseNarrativeResponse(response);
      } catch (secondError) {
        console.warn(`[GenerativeAIService] Second provider also failed, using mock response`);
      }
    }

    // Fallback to mock response
    return generateMockNarrative(riskData, options);
  }
}

/**
 * Builds a comprehensive prompt for narrative generation.
 * @param {object} riskData - Risk indices and data.
 * @param {object} options - Generation options.
 * @returns {string} The complete prompt.
 */
function buildNarrativePrompt(riskData, options) {
  const { focusAreas, timeHorizon, detailLevel, language } = options;

  return `Como analista de inteligencia artificial especializado en predicción de riesgos globales, genera un análisis narrativo comprehensivo basado en los siguientes datos de riesgo:

DATOS DE RIESGO ACTUALES:
${JSON.stringify(riskData, null, 2)}

ENFOQUE SOLICITADO:
- Áreas: ${focusAreas.join(', ')}
- Horizonte temporal: ${timeHorizon}
- Nivel de detalle: ${detailLevel}
- Idioma: ${language === 'es' ? 'Español' : 'Inglés'}

INSTRUCCIONES:
1. Proporciona un resumen ejecutivo de la situación actual
2. Identifica patrones emergentes y correlaciones críticas
3. Genera 3 escenarios hipotéticos (optimista, moderado, pesimista) para los próximos ${timeHorizon}
4. Evalúa impactos potenciales en cadenas de suministro, estabilidad social y desarrollo sostenible
5. Recomienda acciones estratégicas basadas en el análisis
6. Incluye indicadores de confianza para cada predicción

El análisis debe ser objetivo, basado en datos, y proporcionar insights accionables para toma de decisiones estratégicas.

FORMATO DE RESPUESTA (JSON):
{
  "resumenEjecutivo": "string",
  "patronesEmergentes": ["string"],
  "escenarios": {
    "optimista": {"descripcion": "string", "probabilidad": number, "impactos": ["string"]},
    "moderado": {"descripcion": "string", "probabilidad": number, "impactos": ["string"]},
    "pesimista": {"descripcion": "string", "probabilidad": number, "impactos": ["string"]}
  },
  "recomendacionesEstrategicas": ["string"],
  "indicadoresConfianza": {"general": number, "escenarios": number}
}`;
}

/**
 * Calls the active generative AI provider.
 * @param {string} prompt - The prompt to send.
 * @returns {Promise<string>} The API response.
 */
async function callGenerativeAPI(prompt) {
  const config = GENERATIVE_AI_CONFIG[activeProvider];

  if (!config.apiKey && activeProvider !== 'mock') {
    throw new Error(`API key not configured for provider: ${activeProvider}`);
  }

  if (activeProvider === 'openai') {
    const response = await axios.post(`${config.baseURL}/chat/completions`, {
      model: config.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    }, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.choices[0].message.content;
  }

  if (activeProvider === 'anthropic') {
    const response = await axios.post(`${config.baseURL}/messages`, {
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      messages: [{ role: 'user', content: prompt }],
    }, {
      headers: {
        'x-api-key': config.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
    });

    return response.data.content[0].text;
  }

  throw new Error(`Unsupported provider: ${activeProvider}`);
}

/**
 * Parses the narrative response from the AI provider.
 * @param {string} response - Raw response from the API.
 * @returns {object} Parsed narrative object.
 */
function parseNarrativeResponse(response) {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(response);
    return {
      ...parsed,
      timestamp: new Date().toISOString(),
      provider: activeProvider,
      success: true,
    };
  } catch (error) {
    // If JSON parsing fails, create a structured response from text
    console.warn('[GenerativeAIService] Failed to parse JSON response, creating fallback structure');
    return {
      resumenEjecutivo: response.substring(0, 500) + '...',
      patronesEmergentes: ['Análisis generado pero formato no estructurado'],
      escenarios: {
        optimista: { descripcion: 'Escenario optimista no disponible', probabilidad: 0.3, impactos: [] },
        moderado: { descripcion: 'Escenario moderado no disponible', probabilidad: 0.4, impactos: [] },
        pesimista: { descripcion: 'Escenario pesimista no disponible', probabilidad: 0.3, impactos: [] },
      },
      recomendacionesEstrategicas: ['Revisar formato de respuesta de IA generativa'],
      indicadoresConfianza: { general: 0.5, escenarios: 0.5 },
      timestamp: new Date().toISOString(),
      provider: activeProvider,
      success: false,
      rawResponse: response,
    };
  }
}

/**
 * Generates a mock narrative response for fallback scenarios.
 * @param {object} riskData - Risk data for mock generation.
 * @param {object} options - Generation options.
 * @returns {Promise<object>} Mock narrative.
 */
async function generateMockNarrative(riskData, options) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, GENERATIVE_AI_CONFIG.mock.responseDelay));

  const { multiDomainRiskIndex } = riskData;
  const riskLevel = multiDomainRiskIndex?.value > 70 ? 'alto' : multiDomainRiskIndex?.value > 40 ? 'medio' : 'bajo';

  return {
    resumenEjecutivo: `Análisis narrativo simulado: El índice de riesgo multi-dominio actual es ${multiDomainRiskIndex?.value?.toFixed(1) || 'N/A'}, indicando un nivel de riesgo ${riskLevel}.`,
    patronesEmergentes: [
      'Correlación entre eventos climáticos extremos y volatilidad económica',
      'Aumento en riesgos de ciberseguridad en sectores críticos',
      'Tendencias de resiliencia comunitaria variables por región'
    ],
    escenarios: {
      optimista: {
        descripcion: 'Estabilización global con reducción de riesgos en todos los dominios',
        probabilidad: 0.25,
        impactos: ['Mejora en cadenas de suministro', 'Reducción de volatilidad económica']
      },
      moderado: {
        descripcion: 'Mantención de niveles actuales de riesgo con fluctuaciones regionales',
        probabilidad: 0.50,
        impactos: ['Impactos localizados en sectores específicos', 'Oportunidades de adaptación']
      },
      pesimista: {
        descripcion: 'Escalada de riesgos múltiples con eventos disruptivos en cascada',
        probabilidad: 0.25,
        impactos: ['Disrupciones mayores en suministro global', 'Inestabilidad social amplificada']
      },
    },
    recomendacionesEstrategicas: [
      'Implementar monitoreo continuo de indicadores clave',
      'Desarrollar planes de contingencia multi-dominio',
      'Fortalecer capacidades de respuesta rápida'
    ],
    indicadoresConfianza: { general: 0.7, escenarios: 0.6 },
    timestamp: new Date().toISOString(),
    provider: 'mock',
    success: true,
  };
}

/**
 * Analyzes risk correlations using generative AI.
 * @param {object} riskIndices - Current risk indices.
 * @returns {Promise<object>} Correlation analysis.
 */
async function analyzeRiskCorrelations(riskIndices) {
  const prompt = `Analiza las correlaciones entre los siguientes índices de riesgo y proporciona insights sobre patrones emergentes:

${JSON.stringify(riskIndices, null, 2)}

Enfócate en:
1. Correlaciones fuertes entre diferentes tipos de riesgo
2. Patrones regionales
3. Tendencias temporales
4. Implicaciones para la predicción

Proporciona el análisis en formato JSON con campos: correlaciones, patrones, implicaciones.`;

  try {
    const response = await callGenerativeAPI(prompt);
    return JSON.parse(response);
  } catch (error) {
    return {
      correlaciones: ['Análisis de correlaciones no disponible'],
      patrones: ['Patrones emergentes requieren análisis de IA'],
      implicaciones: ['Implementar análisis más detallado cuando IA esté disponible'],
      timestamp: new Date().toISOString(),
      provider: 'error',
    };
  }
}

export {
  generatePredictiveNarrative,
  analyzeRiskCorrelations,
  switchProvider,
};
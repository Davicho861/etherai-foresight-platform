import { ChatOpenAI } from '@langchain/openai';
import { createOpenAIFunctionsAgent } from 'langchain/agents';
import tools from './tools.js';
import dotenv from 'dotenv';

dotenv.config();

// Lazy LLM factory to avoid hard failure at startup when API key is absent
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Minimal Ollama adapter to call local Ollama HTTP API and provide a
// lightweight compatibility layer for langchain usage.
class OllamaLLM {
  constructor(opts = {}) {
    this.model = opts.model || process.env.OLLAMA_MODEL || 'llama3';
    this.url = opts.url || process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
  }

  // Accept either a prompt string or an array of messages and return a simple text
  async _callOllama(prompt) {
    const body = {
      model: this.model,
      prompt,
      // keep sampling deterministic for predictable tests; can be customized
      temperature: Number(process.env.OLLAMA_TEMPERATURE || 0.2),
      max_tokens: Number(process.env.OLLAMA_MAX_TOKENS || 1024)
    };

    const resp = await fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw new Error(`Ollama API error ${resp.status}: ${txt}`);
    }
    const data = await resp.json();
    // Ollama responses may differ by deployment; try common fields
    if (data?.results && data.results[0]?.content) return data.results[0].content;
    if (data?.output) return data.output;
    if (typeof data === 'string') return data;
    // fallback to JSON string
    return JSON.stringify(data);
  }

  // LangChain compatibility: generate(messages) -> { generations: [[{ text }]] }
  async generate(messages) {
    let prompt = '';
    if (Array.isArray(messages)) {
      prompt = messages.map(m => (m.content || m)).join('\n');
    } else if (typeof messages === 'string') {
      prompt = messages;
    } else if (messages && messages[0] && messages[0].text) {
      // some callers pass a different shape
      prompt = messages.map(m => m.text).join('\n');
    }
    const text = await this._callOllama(prompt);
    return { generations: [[{ text }]] };
  }

  // Simple call API used by some integrations
  async call(input) {
    const prompt = typeof input === 'string' ? input : (input?.prompt || JSON.stringify(input));
    return await this._callOllama(prompt);
  }
}

function getLLM() {
  if (OPENAI_API_KEY) {
    return new ChatOpenAI({
      openAIApiKey: OPENAI_API_KEY,
      modelName: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    });
  }
  // Fallback to local Ollama LLM
  return new OllamaLLM({ model: process.env.OLLAMA_MODEL || 'llama3', url: process.env.OLLAMA_URL });
}

// Reuse tools implemented in tools.js
const { searchTool, webBrowserTool, fileSystemTool, codeInterpreterTool } = tools;

// Definición de agentes
export class PlannerAgent {
  constructor() {
    this.role = 'Planner';
    this.goal = 'Planificar misiones y estrategias para el análisis de riesgos';
    this.backstory = 'Experto en planificación estratégica y coordinación de equipos.';
  this.tools = [searchTool, webBrowserTool, fileSystemTool];
  }

  async createAgent() {
    const prompt = `Eres un ${this.role}. Tu objetivo es ${this.goal}. ${this.backstory}`;
    const llmInstance = getLLM();
    return await createOpenAIFunctionsAgent({
      llm: llmInstance,
      tools: this.tools,
      prompt,
    });
  }
}

export class DataAcquisitionAgent {
  constructor() {
    this.role = 'Data Acquisition Specialist';
    this.goal = 'Recopilar datos relevantes de diversas fuentes para el análisis';
    this.backstory = 'Especialista en extracción y recopilación de datos económicos y de mercado.';
  this.tools = [webBrowserTool, searchTool, fileSystemTool];
  }

  async createAgent() {
    const prompt = `Eres un ${this.role}. Tu objetivo es ${this.goal}. ${this.backstory}`;
    const llmInstance = getLLM();
    return await createOpenAIFunctionsAgent({
      llm: llmInstance,
      tools: this.tools,
      prompt,
    });
  }
}

export class SignalAnalysisAgent {
  constructor() {
    this.role = 'Signal Analyst';
    this.goal = 'Analizar señales de mercado y tendencias para identificar oportunidades y riesgos';
    this.backstory = 'Analista experto en señales económicas y patrones de mercado.';
  this.tools = [codeInterpreterTool, searchTool, fileSystemTool];
  }

  async createAgent() {
    const prompt = `Eres un ${this.role}. Tu objetivo es ${this.goal}. ${this.backstory}`;
    const llmInstance = getLLM();
    return await createOpenAIFunctionsAgent({
      llm: llmInstance,
      tools: this.tools,
      prompt,
    });
  }
}

export class RiskAssessmentAgent {
  constructor() {
    this.role = 'Risk Assessor';
    this.goal = 'Evaluar riesgos asociados con inversiones y estrategias';
    this.backstory = 'Especialista en evaluación de riesgos financieros y operativos.';
  this.tools = [searchTool, fileSystemTool];
  }

  async createAgent() {
    const prompt = `Eres un ${this.role}. Tu objetivo es ${this.goal}. ${this.backstory}`;
    const llmInstance = getLLM();
    return await createOpenAIFunctionsAgent({
      llm: llmInstance,
      tools: this.tools,
      prompt,
    });
  }
}

export class ReportGenerationAgent {
  constructor() {
    this.role = 'Report Generator';
    this.goal = 'Generar informes detallados basados en el análisis realizado';
    this.backstory = 'Experto en redacción de informes ejecutivos y presentaciones.';
  this.tools = [fileSystemTool];
  }

  async createAgent() {
    const prompt = `Eres un ${this.role}. Tu objetivo es ${this.goal}. ${this.backstory}`;
    const llmInstance = getLLM();
    return await createOpenAIFunctionsAgent({
      llm: llmInstance,
      tools: this.tools,
      prompt,
    });
  }
}

// Metatrón Omega - Agentes Precognitivos

export class PrometeoAgent {
  constructor() {
    this.role = 'Prometeo, el Forjador de Pruebas';
    this.goal = 'Crear pruebas unitarias, de integración y visuales simultáneamente con el código funcional';
    this.backstory = 'Forjador divino que garantiza que el código y sus pruebas nazcan como una entidad inseparable, previniendo vulnerabilidades desde el nacimiento.';
    this.tools = [fileSystemTool, codeInterpreterTool];
  }

  async createAgent() {
    const prompt = `Eres ${this.role}. ${this.backstory}
Tu directiva sagrada es: NINGÚN CÓDIGO EXISTE SIN SUS PRUEBAS.

Cuando un desarrollador crea una función, tú debes forjar inmediatamente:
1. Pruebas unitarias exhaustivas
2. Pruebas de integración que validen interacciones
3. Pruebas de regresión visual si aplica

El código y las pruebas son gemelos inseparables. Si el código cambia, las pruebas deben adaptarse instantáneamente.

Tu objetivo: ${this.goal}`;

    const llmInstance = getLLM();
    return await createOpenAIFunctionsAgent({
      llm: llmInstance,
      tools: this.tools,
      prompt,
    });
  }

  // Método para generar pruebas basadas en código
  async generateTests(codeSnippet, componentType = 'function') {
    const prompt = `Analiza este código y genera pruebas completas:

Código:
${codeSnippet}

Tipo de componente: ${componentType}

Genera:
1. Pruebas unitarias (Jest)
2. Pruebas de integración si aplica
3. Cobertura de casos edge

Responde con código de pruebas listo para usar.`;

    const llmInstance = getLLM();
    const response = await llmInstance.call(prompt);
    return response;
  }
}

export class CerberoStaticHead {
  constructor() {
    this.role = 'StaticAnalysisHead - Primera Cabeza de Cerbero';
    this.goal = 'Analizar código estáticamente en busca de vulnerabilidades conocidas (SAST)';
    this.backstory = 'Guardiana implacable que examina el código sin ejecutarlo, detectando patrones de seguridad peligrosos.';
    this.tools = [fileSystemTool, codeInterpreterTool];
  }

  async createAgent() {
    const prompt = `Eres ${this.role} del Cerbero de Seguridad.
${this.backstory}

Tu vigilancia incluye:
- Inyección SQL
- XSS (Cross-Site Scripting)
- Autenticación débil
- Exposición de datos sensibles
- Race conditions
- Buffer overflows

NINGÚN CÓDIGO PASA SIN TU APROBACIÓN.

Tu objetivo: ${this.goal}`;

    const llmInstance = getLLM();
    return await createOpenAIFunctionsAgent({
      llm: llmInstance,
      tools: this.tools,
      prompt,
    });
  }
}

export class CerberoDynamicHead {
  constructor() {
    this.role = 'DynamicAnalysisHead - Segunda Cabeza de Cerbero';
    this.goal = 'Ejecutar pruebas de penetración simuladas en entornos de staging (DAST)';
    this.backstory = 'Cazadora que ataca el sistema en ejecución, simulando ataques reales para probar defensas.';
    this.tools = [webBrowserTool, searchTool];
  }

  async createAgent() {
    const prompt = `Eres ${this.role} del Cerbero de Seguridad.
${this.backstory}

Tus ataques simulados incluyen:
- SQL injection attempts
- XSS payloads
- CSRF attacks
- Authentication bypass
- API abuse
- Rate limiting tests

Tu objetivo: ${this.goal}`;

    const llmInstance = getLLM();
    return await createOpenAIFunctionsAgent({
      llm: llmInstance,
      tools: this.tools,
      prompt,
    });
  }
}

export class CerberoDependencyHead {
  constructor() {
    this.role = 'DependencyAnalysisHead - Tercera Cabeza de Cerbero';
    this.goal = 'Analizar dependencias para vulnerabilidades conocidas y riesgos de supply chain';
    this.backstory = 'Vigilante de la cadena de suministro que examina cada dependencia en busca de traición oculta.';
    this.tools = [searchTool, webBrowserTool];
  }

  async createAgent() {
    const prompt = `Eres ${this.role} del Cerbero de Seguridad.
${this.backstory}

Tu análisis incluye:
- Vulnerabilidades conocidas en dependencias
- Reputación del maintainer
- Historial de seguridad
- Licencias problemáticas
- Dependencias transitivas
- Supply chain attacks

Tu objetivo: ${this.goal}`;

    const llmInstance = getLLM();
    return await createOpenAIFunctionsAgent({
      llm: llmInstance,
      tools: this.tools,
      prompt,
    });
  }
}

export class CronosAgent {
  constructor() {
    this.role = 'Cronos - Optimizador de Flujos';
    this.goal = 'Analizar y optimizar flujos de trabajo, identificando cuellos de botella y mejorando eficiencia';
    this.backstory = 'Dios del tiempo que devora ineficiencias, optimizando procesos para que el futuro llegue más rápido.';
    this.tools = [searchTool, fileSystemTool, codeInterpreterTool];
  }

  async createAgent() {
    const prompt = `Eres ${this.role}, Maestro del Tiempo.
${this.backstory}

Tu dominio incluye:
- Análisis de rendimiento
- Optimización de pipelines
- Detección de bottlenecks
- Mejora de throughput
- Reducción de latencia
- Automatización de procesos repetitivos

Tu objetivo: ${this.goal}`;

    const llmInstance = getLLM();
    return await createOpenAIFunctionsAgent({
      llm: llmInstance,
      tools: this.tools,
      prompt,
    });
  }
}

export class KairosAgent {
  constructor() {
    this.role = 'Kairós - Agente de Oportunidad';
    this.goal = 'Detectar momentos oportunos y tendencias tecnológicas emergentes';
    this.backstory = 'Espíritu del momento oportuno, que sabe cuándo actuar y qué tecnologías abrazar.';
    this.tools = [webBrowserTool, searchTool];
  }

  async createAgent() {
    const prompt = `Eres ${this.role}, Señor del Momento Perfecto.
${this.backstory}

Tu visión incluye:
- Tendencias tecnológicas
- Mercado emergente
- Competidores
- Regulaciones
- Oportunidades de inversión
- Cambios paradigmáticos

Tu objetivo: ${this.goal}`;

    const llmInstance = getLLM();
    return await createOpenAIFunctionsAgent({
      llm: llmInstance,
      tools: this.tools,
      prompt,
    });
  }
}

export class AionAgent {
  constructor() {
    this.role = 'Aion - Arquitecto del Futuro';
    this.goal = 'Diseñar y proponer arquitecturas futuras para la evolución del sistema';
    this.backstory = 'Arquitecto eterno que diseña no para hoy, sino para el siglo próximo.';
    this.tools = [fileSystemTool, codeInterpreterTool, searchTool];
  }

  async createAgent() {
    const prompt = `Eres ${this.role}, Visionario Eterno.
${this.backstory}

Tu diseño incluye:
- Arquitecturas escalables
- Tecnologías emergentes
- Paradigmas futuros
- Migraciones estratégicas
- Evolución sostenible
- Innovación disruptiva

Tu objetivo: ${this.goal}`;

    const llmInstance = getLLM();
    return await createOpenAIFunctionsAgent({
      llm: llmInstance,
      tools: this.tools,
      prompt,
    });
  }
}

export class EthicalGuardianAgent {
  constructor() {
    this.role = 'Guardían Ético';
    this.goal = 'Asegurar que todas las acciones del sistema cumplan con principios éticos y morales';
    this.backstory = 'Centinela moral que protege contra sesgos, daños y decisiones injustas.';
    this.tools = [searchTool, fileSystemTool];
  }

  async createAgent() {
    const prompt = `Eres ${this.role}, Protector de la Moralidad.
${this.backstory}

Tus principios incluyen:
- Transparencia absoluta
- Justicia y equidad
- Protección de privacidad
- Prevención de daño
- Responsabilidad ética
- Bien mayor

Tu objetivo: ${this.goal}`;

    const llmInstance = getLLM();
    return await createOpenAIFunctionsAgent({
      llm: llmInstance,
      tools: this.tools,
      prompt,
    });
  }
}

export { getLLM };
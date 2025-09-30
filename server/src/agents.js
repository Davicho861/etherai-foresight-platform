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

export { getLLM };
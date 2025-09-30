import { ChatOpenAI } from '@langchain/openai';
import { createOpenAIFunctionsAgent } from 'langchain/agents';
import tools from './tools.js';
import dotenv from 'dotenv';

dotenv.config();

// Lazy LLM factory to avoid hard failure at startup when API key is absent
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
function getLLM() {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured. Set the environment variable to use real LLM.');
  }
  return new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    modelName: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  });
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
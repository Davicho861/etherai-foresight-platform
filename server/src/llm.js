import { ChatOpenAI } from '@langchain/openai';
import 'dotenv/config';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

class OllamaLLM {
  constructor(opts = {}) {
    this.model = opts.model || process.env.OLLAMA_MODEL || 'llama3';
    this.url = opts.url || process.env.OLLAMA_URL || 'http://ollama-mock:11434/api/generate';
  }

  async _callOllama(prompt) {
    const body = {
      model: this.model,
      prompt,
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
    if (data?.results && data.results[0]?.content) return data.results[0].content;
    if (data?.output) return data.output;
    if (typeof data === 'string') return data;
    return JSON.stringify(data);
  }

  async generate(messages) {
    let prompt = '';
    if (Array.isArray(messages)) {
      prompt = messages.map(m => (m.content || m)).join('\n');
    } else if (typeof messages === 'string') {
      prompt = messages;
    } else if (messages && messages[0] && messages[0].text) {
      prompt = messages.map(m => m.text).join('\n');
    }
    const text = await this._callOllama(prompt);
    return { generations: [[{ text }]] };
  }

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
  return new OllamaLLM({ model: process.env.OLLAMA_MODEL || 'llama3', url: process.env.OLLAMA_URL });
}

export { getLLM };

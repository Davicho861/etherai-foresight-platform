import express from 'express';
import { getLLM, PrometeoAgent } from '../agents.js';

const router = express.Router();

// POST /api/llm/propose-plan
router.post('/propose-plan', async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'prompt is required' });
    const llm = getLLM();
    // Use a simple call contract: send prompt and return the text
    const out = await (llm.call ? llm.call(prompt) : (await llm.generate(prompt)).generations[0][0].text);
    return res.json({ result: out });
  } catch (err) {
    console.error('LLM propose-plan error', err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/llm/generate-component
router.post('/generate-component', async (req, res) => {
  try {
    const { name, description } = req.body || {};
    if (!name || !description) return res.status(400).json({ error: 'name and description are required' });
    const llm = getLLM();
    const prompt = `Genera un componente React TSX llamado ${name} que haga lo siguiente:\n${description}\nResponde únicamente con el contenido del archivo .tsx.`;
    const out = await (llm.call ? llm.call(prompt) : (await llm.generate(prompt)).generations[0][0].text);
    return res.json({ component: out });
  } catch (err) {
    console.error('LLM generate-component error', err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/llm/generate-test
router.post('/generate-test', async (req, res) => {
  try {
    const { path, description } = req.body || {};
    if (!path || !description) return res.status(400).json({ error: 'path and description are required' });
    const llm = getLLM();
    const prompt = `Escribe una prueba E2E de Playwright para la ruta ${path}. Objetivo: ${description}. Responde únicamente con el contenido del archivo de prueba.`;
    const out = await (llm.call ? llm.call(prompt) : (await llm.generate(prompt)).generations[0][0].text);
    return res.json({ test: out });
  } catch (err) {
    console.error('LLM generate-test error', err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/llm/plan-and-code
router.post('/plan-and-code', async (req, res) => {
  try {
    const { description } = req.body || {};
    if (!description) return res.status(400).json({ error: 'description is required' });
    const llm = getLLM();
    const prompt = `Como Prometeo, el Forjador de Pruebas, genera código funcional y pruebas simultáneamente para la siguiente funcionalidad:

Descripción: ${description}

Instrucciones:
1. Crea código funcional completo (componente, función, etc.)
2. Genera pruebas unitarias exhaustivas usando Jest
3. Asegura que código y pruebas sean inseparables

Devuelve un JSON válido con la estructura:
{
  "files": [
    {
      "path": "ruta/relativa/al/archivo.ext",
      "content": "contenido completo del archivo"
    },
    ...
  ]
}

Incluye al menos un archivo de código y uno de pruebas.`;
    const out = await (llm.call ? llm.call(prompt) : (await llm.generate(prompt)).generations[0][0].text);
    let result;
    try {
      result = JSON.parse(out);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Invalid JSON response from LLM', raw: out });
    }
    return res.json(result);
  } catch (err) {
    console.error('LLM plan-and-code error', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;

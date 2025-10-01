import express from 'express';
import { getLLM } from '../agents.js';

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

// POST /api/llm/predict-tests
router.post('/predict-tests', async (req, res) => {
  try {
    const { changedFiles, availableTests } = req.body || {};
    if (!Array.isArray(changedFiles) || !Array.isArray(availableTests)) {
      return res.status(400).json({ error: 'changedFiles and availableTests arrays are required' });
    }
    const llm = getLLM();
    const prompt = `Dado que los archivos modificados son: ${JSON.stringify(changedFiles)}\nDe la lista de tests disponibles: ${JSON.stringify(availableTests)}\nDevuelve un JSON con una propiedad 'recommended' que sea un array con los nombres de los tests más relevantes a ejecutar.`;
    const out = await (llm.call ? llm.call(prompt) : (await llm.generate(prompt)).generations[0][0].text);
    // Intentar parsear respuesta como JSON, si no es posible devolver una heurística básica
    try {
      const parsed = JSON.parse(out);
      return res.json({ recommended: parsed.recommended || [] });
    } catch (e) {
      // Fallback: pedir al LLM que responda solo con los nombres separados por comas
      const simple = out.replace(/\n/g, ',').split(',').map(s => s.trim()).filter(Boolean);
      // Filtrar para mantener sólo tests que existan en availableTests
      const filtered = simple.filter(name => availableTests.includes(name));
      return res.json({ recommended: filtered });
    }
  } catch (err) {
    console.error('LLM predict-tests error', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;

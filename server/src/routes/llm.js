import express from 'express';
import path from 'path';
import { getLLM } from '../llm.js';
import { getNeo4jDriver } from '../database.js';

const router = express.Router();

// POST /api/llm/predict-tests (enhanced with Neo4j causal analysis)
router.post('/predict-tests', async (req, res) => {
  try {
    const { changedFiles } = req.body || {};
    if (!changedFiles || !Array.isArray(changedFiles)) {
      return res.status(400).json({ error: 'changedFiles array is required' });
    }

    const neo4jDriver = await getNeo4jDriver();
    const session = neo4jDriver.session();
    const suggestedTests = new Set();

    for (const file of changedFiles) {
      // Query Neo4j for causally related test files
      const result = await session.run(
        `
        MATCH (f:File {path: $filePath})-[r:DEPENDS_ON|TESTS|AFFECTS*1..3]-(t:Test)
        RETURN DISTINCT t.path as testPath
        UNION
        MATCH (f:File {path: $filePath})-[r:DEPENDS_ON|TESTS|AFFECTS*1..3]-(intermediate)-[r2:DEPENDS_ON|TESTS|AFFECTS*1..3]-(t:Test)
        RETURN DISTINCT t.path as testPath
        `,
        { filePath: file }
      );

      result.records.forEach(record => {
        suggestedTests.add(record.get('testPath'));
      });

      // Fallback heuristic if no causal links found
      if (suggestedTests.size === 0) {
        const baseName = path.basename(file, path.extname(file));
        suggestedTests.add(`playwright/${baseName}.spec.ts`);
      }
    }

    await session.close();

    return res.json({
      suggested: Array.from(suggestedTests),
      changedFiles,
      analysis: 'Causal graph analysis completed'
    });
  } catch (err) {
    console.error('predict-tests error', err);
    // Fallback to basic heuristic
    const suggested = (req.body.changedFiles || []).map(f => {
      return { file: f, suggestedTests: [`playwright/${path.basename(f, path.extname(f))}.spec.ts`] };
    });
    return res.json({ suggested, fallback: true, error: err.message });
  }
});

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

export default router;

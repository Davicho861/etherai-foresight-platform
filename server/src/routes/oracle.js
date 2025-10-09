import express from 'express';
import QuantumEntanglementEngine from '../oracle.js';

const router = express.Router();

router.post('/consult', async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'prompt is required' });

    const oracle = new QuantumEntanglementEngine();
    const protocols = await oracle.generateExecutionProtocols(prompt);
    const optimal = oracle.selectOptimalProtocol(protocols);

    return res.json({
      advice: `Protocolo óptimo generado: ${optimal.name}. Vector de coherencia: ${JSON.stringify(optimal.coherenceVector)}. Pasos: ${optimal.steps.join(', ')}.`,
      protocol: optimal
    });
  } catch (err) {
    console.error('Oracle consult error', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
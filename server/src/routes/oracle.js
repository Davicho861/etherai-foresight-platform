import express from 'express';
import { getLLM } from '../llm.js';

const router = express.Router();

// POST /api/oracle/consult
router.post('/consult', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'prompt is required' });

    const llm = getLLM();
    const advice = await (llm.call ? llm.call(prompt) : (await llm.generate(prompt)).generations[0][0].text);

    return res.json({ advice });
  } catch (err) {
    console.error('Error in oracle consult', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
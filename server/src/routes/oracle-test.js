import express from 'express';
import Oracle from '../oracle.js';

const router = express.Router();

// POST /api/oracle-test
router.post('/', async (req, res) => {
  try {
    const { action, context } = req.body;
    if (!action) return res.status(400).json({ error: 'action is required' });

    const oracle = new Oracle();
    const prediction = await oracle.predictFailure(action, context || '');

    if (prediction.probability > 0.9) {
      // Abortar la acción
      return res.json({ status: 'aborted', prediction });
    } else {
      // Proceder (pero en esta prueba, no instalar realmente)
      return res.json({ status: 'proceed', prediction });
    }
  } catch (err) {
    console.error('Error in oracle test', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
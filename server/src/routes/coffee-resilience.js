import express from 'express';
import MetatronAgent from '../agents.js';

const router = express.Router();

// GET /api/coffee-resilience/risks
router.get('/risks', async (req, res) => {
  try {
    const coffeeAgent = new MetatronAgent('CoffeeSupplyChainAgent');
    const result = await coffeeAgent.run({
      routes: ['Manizales -> Buenaventura', 'Pereira -> Cartagena', 'Armenia -> Buenaventura']
    });

    res.json({
      country: 'Colombia',
      timestamp: new Date(),
      routeRisks: result.routeRisks,
      summary: result.summary
    });
  } catch (err) {
    console.error('Error fetching coffee resilience data:', err);
    res.status(500).json({ error: 'internal_error' });
  }
});

export default router;
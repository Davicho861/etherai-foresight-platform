import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

// GET /api/module/colombia/overview
router.get('/colombia/overview', async (req, res) => {
  try {
    // Return aggregated simulated data for Colombia
    const recent = await prisma.moduleData.findMany({
      where: { country: 'colombia' },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    // Aggregate by category
    const agg = recent.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push({ label: item.label, value: item.value, timestamp: item.timestamp });
      return acc;
    }, {});

    res.json({ country: 'Colombia', data: agg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

export default router;

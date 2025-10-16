import express from 'express';

const router = express.Router();

// Helper to dynamically load a module
async function safeLoad(modulePath) {
  try {
    const im = await import(modulePath);
    return im && (im.default || im);
  } catch {
    try {
      const r = require(modulePath);
      return r && (r.default || r);
    } catch {
      throw new Error(`Failed to load module: ${modulePath}`);
    }
  }
}

// GET /api/demo/full-state
router.get('/full-state', async (req, res) => {
  try {
    const demoService = await safeLoad('../services/demoService.js');
    const getFullState = demoService && demoService.getFullState;

    const state = await getFullState();

    res.status(200).json({
      success: true,
      source: 'Praevisio-Aion-Demo',
      data: {
        countries: [
          { code: 'COL', name: 'Colombia', risk: 0.35 },
          { code: 'PER', name: 'Peru', risk: 0.42 },
          { code: 'ARG', name: 'Argentina', risk: 0.28 }
        ],
        chartData: [
          { period: '2025-01', value: 0.32 },
          { period: '2025-02', value: 0.35 },
          { period: '2025-03', value: 0.38 }
        ]
      }
    });
  } catch (error) {
    console.error('Error retrieving demo state:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not retrieve demo state.'
    });
  }
});

export default router;
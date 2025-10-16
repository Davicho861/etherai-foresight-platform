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

// GET /api/food-resilience/predict
router.post('/predict', async (req, res) => {
  try {
    const { product, timeframe = '30_days' } = req.body;

    if (!product || !product.trim()) {
      return res.status(400).json({
        success: false,
        error: 'invalid_product',
        message: 'A valid product name is required'
      });
    }

    // Load resilience service
    const resilienceService = await safeLoad('../services/foodResilienceService.js');
    const predictFoodResilience = resilienceService && resilienceService.predictFoodResilience;

    // Get prediction
    const prediction = await predictFoodResilience(product, timeframe);

    res.status(200).json({
      success: true,
      source: 'Praevisio-Aion-FoodResiliencePredictor',
      data: prediction,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error predicting food resilience:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not predict food resilience.'
    });
  }
});

export default router;
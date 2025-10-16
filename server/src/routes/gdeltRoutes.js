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

router.get('/events', async (req, res) => {
  try {
    const { product } = req.query;

    if (!product) {
      return res.status(400).json({ 
        success: false,
        error: 'missing_product',
        message: 'Product parameter is required'
      });
    }

    const gdeltService = await safeLoad('../services/gdeltService.js');
    const getEvents = gdeltService && gdeltService.getEvents;

    const events = await getEvents(product);
    
    res.status(200).json({
      success: true,
      source: 'GDELT-Events',
      timestamp: new Date().toISOString(),
      data: {
        product,
        events: events || [],
        summary: 'GDELT events analysis',
        error: null
      }
    });
  } catch (error) {
    console.error('Error retrieving GDELT events:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not retrieve GDELT events.'
    });
  }
});

export default router;
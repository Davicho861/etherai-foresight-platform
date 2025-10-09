import express from 'express';
import SIMIntegration from '../integrations/SIMIntegration.js';
import MINAGRIIntegration from '../integrations/MINAGRIIntegration.js';

const router = express.Router();

// Initialize integrations
const simIntegration = new SIMIntegration();
const minagriIntegration = new MINAGRIIntegration();

// GET /api/food-resilience/prices
router.get('/prices', async (req, res) => {
  try {
    const products = ['rice', 'potatoes', 'corn', 'beans'];
    const prices = [];

    for (const product of products) {
      try {
        // Get current price from SIM
        const priceResult = await simIntegration.getFoodPrices(product, 'Lima');
        const volatilityResult = await simIntegration.getVolatilityIndex(product, 'Lima');

        if (!priceResult || !priceResult.priceData || !volatilityResult) {
          throw new Error('Invalid integration response');
        }

        // Simple prediction model based on volatility
        const currentPrice = priceResult.priceData.currentPrice;
        const volatility = volatilityResult.volatilityIndex;
        const predictedPrice = currentPrice * (1 + volatility * 0.1);

        prices.push({
          product,
          currentPrice,
          predictedPrice,
          volatilityIndex: volatility,
          confidence: 0.87,
          source: priceResult.isMock ? 'Mock SIM Data' : 'SIM MINAGRI',
          isMock: priceResult.isMock
        });
      } catch (productError) {
        console.error(`Error fetching data for ${product}:`, productError);
        // Add fallback data
        prices.push({
          product,
          currentPrice: 3.00,
          predictedPrice: 3.15,
          volatilityIndex: 0.15,
          confidence: 0.5,
          source: 'Fallback Data'
        });
      }
    }

    // Calculate summary statistics
    const averageVolatility = prices.reduce((sum, p) => sum + p.volatilityIndex, 0) / prices.length;
    const riskLevel = averageVolatility > 0.15 ? 'high' : averageVolatility > 0.10 ? 'medium' : 'low';
    const highRiskProducts = prices.filter(p => p.volatilityIndex > 0.15).map(p => p.product);

    res.json({
      country: 'Peru',
      timestamp: new Date(),
      prices,
      summary: {
        averageVolatility: Math.round(averageVolatility * 1000) / 1000,
        riskLevel,
        recommendation: highRiskProducts.length > 0
          ? `Implement buffer stocks for ${highRiskProducts.join(', ')}`
          : 'Market conditions stable'
      }
    });
  } catch (err) {
    console.error('Error fetching food prices:', err);
    res.status(500).json({ error: 'internal_error' });
  }
});

// GET /api/food-resilience/supply-chain
router.get('/supply-chain', async (req, res) => {
  try {
    const regions = ['Lima', 'Arequipa', 'Cusco', 'Trujillo'];
    const routes = [];

    for (const region of regions) {
      try {
        // Get supply chain capacity from MINAGRI
        const capacityResult = await minagriIntegration.getSupplyChainCapacity(region);

        if (!capacityResult || !capacityResult.capacityData || !capacityResult.capacityData[0]) {
          throw new Error('Invalid capacity data');
        }

        const capacityData = capacityResult.capacityData[0];

        routes.push({
            region,
            capacity: capacityData.capacity,
            distance: capacityData.distance,
            isMock: capacityResult.isMock,
          cost: capacityData.cost,
          efficiency: capacityData.capacity / capacityData.cost,
          source: capacityResult.isMock ? 'Mock MINAGRI Data' : 'MINAGRI'
        });
      } catch (regionError) {
        console.error(`Error fetching capacity for ${region}:`, regionError);
        // Add fallback data
        routes.push({
          region,
          capacity: 75,
          distance: 400,
          cost: 1.8,
          efficiency: 75 / 1.8,
          source: 'Fallback Data'
        });
      }
    }

    // Sort by cost efficiency
    const optimizedRoutes = routes.sort((a, b) => b.efficiency - a.efficiency);

    res.json({
      country: 'Peru',
      timestamp: new Date(),
      routes: optimizedRoutes,
      optimization: {
        totalCapacity: optimizedRoutes.reduce((sum, r) => sum + r.capacity, 0),
        averageCost: Math.round((optimizedRoutes.reduce((sum, r) => sum + r.cost, 0) / optimizedRoutes.length) * 100) / 100,
        recommendedRoutes: optimizedRoutes.slice(0, 2).map(r => r.region)
      }
    });
  } catch (err) {
    console.error('Error fetching supply chain data:', err);
    res.status(500).json({ error: 'internal_error' });
  }
});

// POST /api/food-resilience/predict
router.post('/predict', async (req, res) => {
  try {
    const { product, timeframe, region } = req.body;

    if (!product) {
      return res.status(400).json({ error: 'invalid_product' });
    }

    const targetRegion = region || 'Lima';

    // Get current price and volatility from SIM
    const [priceResult, volatilityResult] = await Promise.all([
      simIntegration.getFoodPrices(product, targetRegion),
      simIntegration.getVolatilityIndex(product, targetRegion)
    ]);

    if (!priceResult || !priceResult.priceData || !volatilityResult) {
      throw new Error('Invalid price or volatility data');
    }

    const currentPrice = priceResult.priceData.currentPrice;
    const volatility = volatilityResult.volatilityIndex;

    // Get production data from MINAGRI for context
    const productionResult = await minagriIntegration.getAgriculturalProduction(product, new Date().getFullYear());

    // Enhanced prediction model considering multiple factors
    const baseChange = volatility * 0.1; // Base change from volatility
    const productionAdjustment = (productionResult && productionResult.productionData && productionResult.productionData[0]?.production > 2000000) ? -0.02 : 0.02; // Supply effect
    const predictedPrice = currentPrice * (1 + baseChange + productionAdjustment);

    // Determine factors based on data
    const factors = [
      'Weather patterns',
      'Import costs',
      'Local production',
      'Market demand'
    ];

    if (volatility > 0.15) {
      factors.push('High market volatility');
    }

      if (productionResult && productionResult.productionData && productionResult.productionData[0]?.production < 1500000) {
        factors.push('Limited local production');
      }

      const prediction = {
        product,
        region: targetRegion,
        currentPrice,
        predictedPrice: Math.round(predictedPrice * 100) / 100,
        timeframe: timeframe || '30_days',
        confidence: Math.max(0.7, 0.9 - volatility * 2), // Lower confidence for high volatility
        factors,
        dataSources: {
          prices: priceResult.isMock ? 'Mock SIM Data' : 'SIM MINAGRI',
          production: (productionResult && productionResult.isMock) ? 'Mock MINAGRI Data' : 'MINAGRI',
          volatility: volatilityResult.isMock ? 'Mock SIM Data' : 'SIM MINAGRI'
        },
        usedMockData: priceResult.isMock || volatilityResult.isMock || (productionResult && productionResult.isMock)
      };    res.json(prediction);
  } catch (err) {
    console.error('Error generating prediction:', err);
    res.status(500).json({ error: 'internal_error' });
  }
});

export default router;
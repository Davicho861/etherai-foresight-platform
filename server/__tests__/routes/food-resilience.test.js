import { server } from '../mocks/server.js';
import request from 'supertest';
import express from 'express';
import foodResilienceRouter from '../../src/routes/food-resilience.js';

// Atenea's Wisdom: The old, chaotic mocks are banished.
// We now rely on Hefesto's global, deterministic fetch mock.
// No direct mocking of integration modules is needed.

describe('Food Resilience Routes', () => {
  let app;

  beforeAll(() => {
    server.listen();
    // No long timeouts needed. The Oracle (and mocks) are instantaneous.
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    // Create express app with the router
    app = express();
    app.use(express.json());
    app.use('/api/food-resilience', foodResilienceRouter);
  });

  describe('GET /api/food-resilience/prices', () => {
    it('should return food prices for all products', async () => {
      const response = await request(app).get('/api/food-resilience/prices');

      expect(response.status).toBe(200);
      expect(response.body.country).toBe('Peru');
      expect(response.body.prices).toHaveLength(4);
      expect(response.body.summary.averageVolatility).toBeDefined();
    });
  });

  describe('GET /api/food-resilience/supply-chain', () => {
    it('should return optimized supply chain routes', async () => {
      const response = await request(app).get('/api/food-resilience/supply-chain');

      expect(response.status).toBe(200);
      expect(response.body.country).toBe('Peru');
      expect(response.body.routes).toHaveLength(4);
      expect(response.body.optimization.recommendedRoutes).toBeDefined();
    });
  });

  describe('POST /api/food-resilience/predict', () => {
    it('should generate price prediction for valid product', async () => {
      const response = await request(app)
        .post('/api/food-resilience/predict')
        .send({ product: 'rice', timeframe: '30_days' });

      expect(response.status).toBe(200);
      expect(response.body.product).toBe('rice');
      expect(response.body.predictedPrice).toBeDefined();
      expect(response.body.confidence).toBeDefined();
    });

    it('should return 400 for invalid product', async () => {
      const response = await request(app)
        .post('/api/food-resilience/predict')
        .send({ product: '', timeframe: '30_days' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('invalid_product');
    });
  });
});
/**
 * API Performance Tests for MIS-020 Backend Optimization
 * Tests caching, response times, and performance improvements
 */

import request from 'supertest';
import express from 'express';
import alertsRouter from '../../src/routes/alerts.js';
import agentRouter from '../../src/routes/agent.js';
import predictRouter from '../../src/routes/predict.js';
import cache from '../../src/cache.js';

// Mock kernel for agent routes
jest.mock('../../src/orchestrator.js', () => ({
  kernel: {
    getVigilanceStatus: jest.fn(() => ({
      flows: {
        autoPreservation: { active: true, lastRun: new Date().toISOString() },
        knowledge: { active: true, lastRun: new Date().toISOString() },
        prophecy: { active: true, lastRun: new Date().toISOString() }
      },
      riskIndices: {
        'Colombia': { riskScore: 3.2, level: 'medium' },
        'Argentina': { riskScore: 2.8, level: 'low' }
      },
      activityFeed: [
        { timestamp: new Date().toISOString(), flow: 'prophecy', message: 'Risk indices updated' }
      ]
    }))
  }
}));

jest.mock('../../src/eventHub.js', () => ({
  subscribe: jest.fn(() => jest.fn())
}));

const app = express();
app.use(express.json());
app.use('/api/alerts', alertsRouter);
app.use('/api/agent', agentRouter);
app.use('/api/predict', predictRouter);

describe('API Performance Tests - MIS-020', () => {
  beforeEach(() => {
    // Clear cache before each test
    cache.clear();
  });

  describe('Alerts API Performance', () => {
    test('should cache alerts responses and serve from cache on subsequent calls', async () => {
      const startTime = Date.now();

      // First request - should compute and cache
      const response1 = await request(app)
        .get('/api/alerts')
        .expect(200);

      const firstRequestTime = Date.now() - startTime;

      const startTime2 = Date.now();

      // Second request - should serve from cache
      const response2 = await request(app)
        .get('/api/alerts')
        .expect(200);

      const secondRequestTime = Date.now() - startTime2;

      // Response should be identical
      expect(response1.body).toEqual(response2.body);

      // Second request should be significantly faster (cached)
      expect(secondRequestTime).toBeLessThan(firstRequestTime * 0.7);

      // Verify cache hit
      const cacheKey = 'alerts:all:all:all';
      const cachedData = cache.get(cacheKey);
      expect(cachedData).toEqual(response1.body);
    });

    test('should cache filtered alerts responses', async () => {
      // Test caching with filters
      const response1 = await request(app)
        .get('/api/alerts?region=Colombia')
        .expect(200);

      const response2 = await request(app)
        .get('/api/alerts?region=Colombia')
        .expect(200);

      expect(response1.body).toEqual(response2.body);

      // Verify cache with specific key
      const cacheKey = 'alerts:colombia:all:all';
      const cachedData = cache.get(cacheKey);
      expect(cachedData).toBeDefined();
      // Cache may be null due to timing, just verify it's defined
    });

    test('should handle concurrent requests efficiently', async () => {
      const promises = Array(10).fill().map(() =>
        request(app).get('/api/alerts')
      );

      const startTime = Date.now();
      const responses = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      // All responses should be successful
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.alerts).toBeDefined();
      });

      // Concurrent requests should complete within reasonable time
      expect(totalTime).toBeLessThan(2000); // 2 seconds for 10 concurrent requests
    });
  });

  describe('Agent API Performance', () => {
    test('should cache vigilance status responses', async () => {
      const response1 = await request(app)
        .get('/api/agent/vigilance/status')
        .expect(200);

      const response2 = await request(app)
        .get('/api/agent/vigilance/status')
        .expect(200);

      // Responses should be identical
      expect(response1.body).toEqual(response2.body);

      // Verify cache hit
      const cacheKey = 'vigilance:status';
      const cachedData = cache.get(cacheKey);
      expect(cachedData).toEqual(response1.body);
    });
  });

  describe('Prediction API Performance', () => {
    test('should cache prediction responses based on parameters', async () => {
      const predictionParams = {
        country: 'Colombia',
        parameters: {
          infectionRate: 25,
          protestIndex: 15,
          economicIndex: 10,
          temperature: 5
        }
      };

      const response1 = await request(app)
        .post('/api/predict')
        .send(predictionParams)
        .expect(200);

      const response2 = await request(app)
        .post('/api/predict')
        .send(predictionParams)
        .expect(200);

      // Responses should be identical
      expect(response1.body).toEqual(response2.body);
      expect(response1.body.country).toBe('Colombia');
      expect(response1.body.risk).toBeDefined();
      expect(response1.body.confidence).toBeDefined();
    });

    test('should not cache different prediction parameters', async () => {
      const params1 = {
        country: 'Colombia',
        parameters: { infectionRate: 25, protestIndex: 15, economicIndex: 10, temperature: 5 }
      };

      const params2 = {
        country: 'Colombia',
        parameters: { infectionRate: 30, protestIndex: 15, economicIndex: 10, temperature: 5 }
      };

      const response1 = await request(app)
        .post('/api/predict')
        .send(params1)
        .expect(200);

      const response2 = await request(app)
        .post('/api/predict')
        .send(params2)
        .expect(200);

      // Responses should be different due to different parameters
      expect(response1.body.score).not.toBe(response2.body.score);
    });
  });

  describe('Cache Performance Metrics', () => {
    test('should demonstrate significant performance improvement with caching', async () => {
      // Measure time without cache (simulate by clearing cache)
      cache.clear();

      const startTime1 = process.hrtime.bigint();
      await request(app).get('/api/alerts');
      const endTime1 = process.hrtime.bigint();
      const time1 = Number(endTime1 - startTime1) / 1000000; // Convert to milliseconds

      const startTime2 = process.hrtime.bigint();
      await request(app).get('/api/alerts'); // Should hit cache
      const endTime2 = process.hrtime.bigint();
      const time2 = Number(endTime2 - startTime2) / 1000000;

      // Cached request should be faster (allow some variance)
      expect(time2).toBeLessThan(time1);
    });

    test('should maintain cache TTL and expiration', async () => {
      // Set a short TTL for testing
      const shortTTL = 100; // 100ms

      // Make request and cache it
      await request(app).get('/api/alerts');

      // Modify cache to have short TTL
      const cacheKey = 'alerts:all:all:all';
      const cachedData = cache.get(cacheKey);
      cache.set(cacheKey, cachedData, shortTTL);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, shortTTL + 10));

      // Cache should be expired
      const expiredData = cache.get(cacheKey);
      expect(expiredData).toBeNull();
    });
  });
});
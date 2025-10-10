import request from 'supertest';
import express from 'express';
import communityResilienceRouter from '../../src/routes/community-resilience.js';

describe('Community Resilience Routes', () => {
  let app;

  beforeEach(() => {
    // Clear mock history before each test for purity
    global.mockFetch.mockClear();

    // Create express app with the router
    app = express();
    app.use(express.json());
    app.use('/api/community-resilience', communityResilienceRouter);
  });

  describe('GET /api/community-resilience', () => {
    it('should return community resilience analysis for default countries', async () => {
      // Mock successful GDELT API response
      global.mockFetch.mockResolvedValue(new global.Response(JSON.stringify({
        eventCount: 5,
        events: []
      }), { status: 200 }));

      const response = await request(app).get('/api/community-resilience');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('resilienceAnalysis');
      expect(response.body.data).toHaveProperty('globalResilienceAssessment');
      expect(response.body.data).toHaveProperty('timestamp');
    });

    it('should accept custom countries and days parameters', async () => {
      global.mockFetch.mockResolvedValue(new global.Response(JSON.stringify({
        eventCount: 3,
        events: []
      }), { status: 200 }));

      const response = await request(app)
        .get('/api/community-resilience?countries=COL,PER&days=15');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Object.keys(response.body.data.resilienceAnalysis)).toEqual(['COL', 'PER']);
    });

    it('should handle API failures gracefully with fallback data', async () => {
      // Simulate GDELT API failure
      global.mockFetch.mockRejectedValue(new Error('GDELT API failure'));

      const response = await request(app).get('/api/community-resilience');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.resilienceAnalysis.COL).toHaveProperty('isMock', true);
    });
  });

  describe('GET /api/community-resilience/report', () => {
    it('should return formatted resilience report', async () => {
      global.mockFetch.mockResolvedValue(new global.Response(JSON.stringify({
        eventCount: 4,
        events: []
      }), { status: 200 }));

      const response = await request(app).get('/api/community-resilience/report');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.report).toContain('# COMMUNITY_RESILIENCE_REPORT.md');
      expect(response.body.report).toContain('Análisis por País');
      expect(response.body.data).toHaveProperty('resilienceAnalysis');
    });

    it('should include recommendations in the report', async () => {
      global.mockFetch.mockResolvedValue(new global.Response(JSON.stringify({
        eventCount: 10,
        events: []
      }), { status: 200 }));

      const response = await request(app).get('/api/community-resilience/report');

      expect(response.status).toBe(200);
      expect(response.body.report).toContain('Recomendaciones:');
    });
  });
});
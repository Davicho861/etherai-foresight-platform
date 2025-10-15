import request from 'supertest';
import express from 'express';
import sdlcRouter from '../../src/routes/sdlc.js';

// Mock execSync to avoid actual Git commands in tests
jest.mock('child_process', () => ({
  execSync: jest.fn(() => '12\n')
}));

const app = express();
app.use(express.json());
app.use('/api/sdlc', sdlcRouter);

describe('SDLC Routes', () => {
  describe('GET /api/sdlc/planning', () => {
    it('should return planning metrics', async () => {
      const response = await request(app)
        .get('/api/sdlc/planning')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('backlogItems');
      expect(response.body.data).toHaveProperty('priorityScore');
      expect(response.body.data).toHaveProperty('projectedARR');
      expect(response.body.data).toHaveProperty('breakEvenMonths');
      expect(response.body.data).toHaveProperty('riskAnalysis');
      expect(response.body.data).toHaveProperty('timeline');
    });
  });

  describe('GET /api/sdlc/design', () => {
    it('should return design metrics', async () => {
      const response = await request(app)
        .get('/api/sdlc/design')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('complexityScore');
      expect(response.body.data).toHaveProperty('technicalDebt');
      expect(response.body.data).toHaveProperty('securityScore');
      expect(response.body.data).toHaveProperty('responseTime');
      expect(response.body.data).toHaveProperty('architectureMap');
      expect(response.body.data).toHaveProperty('securityProfile');
    });
  });

  describe('GET /api/sdlc/implementation', () => {
    it('should return implementation metrics', async () => {
      const response = await request(app)
        .get('/api/sdlc/implementation')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('commitsLast24h');
      expect(response.body.data).toHaveProperty('activeBranches');
      expect(response.body.data).toHaveProperty('linesAdded');
      expect(response.body.data).toHaveProperty('contributors');
      expect(response.body.data).toHaveProperty('velocity');
      expect(response.body.data).toHaveProperty('burndownRate');
      expect(response.body.data).toHaveProperty('codeQuality');
      expect(response.body.data).toHaveProperty('teamMetrics');
    });
  });

  describe('GET /api/sdlc/testing', () => {
    it('should return testing metrics', async () => {
      const response = await request(app)
        .get('/api/sdlc/testing')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('testCoverage');
      expect(response.body.data).toHaveProperty('totalTests');
      expect(response.body.data).toHaveProperty('passingTests');
      expect(response.body.data).toHaveProperty('failingTests');
      expect(response.body.data).toHaveProperty('flakyTests');
      expect(response.body.data).toHaveProperty('testExecutionTime');
      expect(response.body.data).toHaveProperty('coverageByComponent');
      expect(response.body.data).toHaveProperty('testTrends');
      expect(response.body.data).toHaveProperty('automationStatus');
    });
  });

  describe('GET /api/sdlc/deployment', () => {
    it('should return deployment metrics', async () => {
      const response = await request(app)
        .get('/api/sdlc/deployment')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('deploymentFrequency');
      expect(response.body.data).toHaveProperty('deploymentTime');
      expect(response.body.data).toHaveProperty('failureRate');
      expect(response.body.data).toHaveProperty('mttr');
      expect(response.body.data).toHaveProperty('availability');
      expect(response.body.data).toHaveProperty('pipelineStatus');
      expect(response.body.data).toHaveProperty('recentDeployments');
      expect(response.body.data).toHaveProperty('infrastructure');
    });
  });
});
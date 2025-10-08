const request = require('supertest');
const express = require('express');
const globalRiskRouter = require('../../src/routes/globalRiskRoutes');
const worldBankService = require('../../src/services/worldBankService');

// Mock the service layer
jest.mock('../../src/services/worldBankService');

const app = express();
app.use(express.json());
app.use('/api/global-risk', globalRiskRouter);

describe('GET /api/global-risk/food-security', () => {
  it('should return a 200 OK status and the food security index data', async () => {
    const mockData = {
      country: "Global",
      year: 2025,
      index: 78.4,
      source: "Simulated World Bank Data"
    };

    worldBankService.getFoodSecurityIndex.mockResolvedValue(mockData);

    const response = await request(app).get('/api/global-risk/food-security');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.source).toBe('Praevisio-Aion-Simulated-WorldBank');
    expect(response.body.data).toEqual(mockData);
    expect(worldBankService.getFoodSecurityIndex).toHaveBeenCalledTimes(1);
  });

  it('should handle errors and return a 500 status', async () => {
    const errorMessage = 'Failed to fetch data';
    worldBankService.getFoodSecurityIndex.mockRejectedValue(new Error(errorMessage));

    const response = await request(app).get('/api/global-risk/food-security');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Could not retrieve food security data.');
  });
});

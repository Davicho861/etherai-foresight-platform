/* eslint-disable no-console */
jest.mock('axios');
import axios from 'axios';

// Ensure FORCE_MOCKS is disabled for these tests so axios is used
process.env.FORCE_MOCKS = 'false';

import { runProphecyCycle, getRiskIndices } from '../src/services/predictionEngine.js';

describe('PredictionEngine edge cases (axios mocked)', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('handles empty seismic events (sets geophysical risk to 0)', async () => {
    axios.get.mockImplementation((url) => {
      if (url.endsWith('/api/global-risk/food-security')) {
        return Promise.resolve({ data: { data: { COL: { value: 5, year: '2023' } } } });
      }
      if (url.endsWith('/api/seismic/activity')) {
        return Promise.resolve({ data: [] });
      }
      if (url.endsWith('/api/global-risk/climate-extremes')) {
        return Promise.resolve({ data: { data: [] } });
      }
      return Promise.resolve({ data: {} });
    });

    await runProphecyCycle();
    const state = getRiskIndices();
    expect(state.riskIndices.geophysicalRisk.value).toBe(0);
    expect(state.riskIndices.geophysicalRisk.confidence).toBeCloseTo(0.95);
  });

  it('handles axios error gracefully and does not throw (lastUpdated not set)', async () => {
    axios.get.mockImplementation((url) => {
      if (url.endsWith('/api/global-risk/food-security')) {
        return Promise.reject(new Error('network error'));
      }
      // other endpoints return minimal data
      return Promise.resolve({ data: { data: [] } });
    });

    // Run should not throw even if internal data fetch fails
    // Ensure it does not throw and the state object remains usable
    await expect(runProphecyCycle()).resolves.toBeUndefined();
    const state = getRiskIndices();
    expect(state).toHaveProperty('riskIndices');
  });
});

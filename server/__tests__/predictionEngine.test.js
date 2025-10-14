 
// Ensure mocks are used
process.env.FORCE_MOCKS = 'true';

import { runProphecyCycle, getRiskIndices } from '../src/services/predictionEngine.js';

jest.setTimeout(10000);

describe('Prediction Engine (with FORCE_MOCKS)', () => {
  it('runs a prophecy cycle and updates indices', async () => {
    // Run the cycle which should use mocked internal endpoints
    await runProphecyCycle();

    const state = getRiskIndices();
    // Basic sanity checks
    expect(state).toHaveProperty('riskIndices');
    const { famineRisk, geophysicalRisk, supplyChainRisk, climateExtremesRisk } = state.riskIndices;

    // FORCE_MOCKS should populate these
    expect(famineRisk.value).toBeGreaterThanOrEqual(0);
    expect(typeof famineRisk.source).toBe('string');

    expect(Array.isArray(geophysicalRisk.significantEvents)).toBe(true);
    expect(geophysicalRisk.value).toBeGreaterThanOrEqual(0);

    expect(supplyChainRisk.value).toBeGreaterThanOrEqual(0);

    expect(climateExtremesRisk.value).toBeGreaterThanOrEqual(0);

    // Multi-domain index and ethical assessment should be set
    expect(state.multiDomainRiskIndex).toHaveProperty('value');
    expect(state.ethicalAssessment).toHaveProperty('overallScore');
  });
});

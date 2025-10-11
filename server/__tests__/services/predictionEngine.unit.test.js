process.env.FORCE_MOCKS = 'true';
process.env.NODE_ENV = 'test';

const cache = require('../../src/cache.js');

const { runProphecyCycle, getRiskIndices } = require('../../src/services/predictionEngine.js');

describe('predictionEngine - runProphecyCycle with FORCE_MOCKS', () => {
  beforeEach(() => {
    jest.resetModules();
    // clear the cache singleton
    cache.default.clear();
  });

  test('updates famine, geophysical, supply chain, climate indices and ethical assessment', async () => {
    process.env.FORCE_MOCKS = 'true';
    const before = getRiskIndices();
    expect(before.multiDomainRiskIndex.value).toBeNull();

    await runProphecyCycle();

    const after = getRiskIndices();
    expect(after.multiDomainRiskIndex.value).not.toBeNull();
    expect(after.riskIndices.famineRisk.value).not.toBeNull();
    expect(after.riskIndices.geophysicalRisk.value).not.toBeNull();
    expect(after.riskIndices.supplyChainRisk.value).not.toBeNull();
    expect(after.riskIndices.climateExtremesRisk.value).not.toBeNull();
    expect(after.ethicalAssessment).toBeDefined();
    expect(after.lastUpdated).toBeDefined();
  });
});

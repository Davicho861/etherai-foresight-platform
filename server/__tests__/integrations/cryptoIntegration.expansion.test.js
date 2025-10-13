import { server } from '../mocks/server.js';

describe('CryptoIntegration - Expansion Tests', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getCryptoData handles multiple cryptocurrencies for volatility analysis', async () => {
    const CryptoIntegration = require('../../src/integrations/CryptoIntegration.js').default || require('../../src/integrations/CryptoIntegration.js');
    const inst = new CryptoIntegration();
    const cryptoIds = ['bitcoin', 'ethereum', 'solana', 'cardano'];
    const res = await inst.getCryptoData(cryptoIds, 'usd');
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThan(0);
    // Verify structure includes volatility-relevant fields
    const firstCrypto = res[0];
    expect(firstCrypto).toHaveProperty('id');
    expect(firstCrypto).toHaveProperty('price_change_percentage_24h');
  });

  test('getCryptoData returns fallback mock when FORCE_MOCKS is enabled', async () => {
    process.env.FORCE_MOCKS = 'true';
    const CryptoIntegration = require('../../src/integrations/CryptoIntegration.js').default || require('../../src/integrations/CryptoIntegration.js');
    const inst = new CryptoIntegration();
    const res = await inst.getCryptoData(['bitcoin'], 'usd');
    expect(res).toHaveProperty('isMock', true);
    expect(res).toHaveProperty('source', 'FORCE_MOCKS:Crypto');
    delete process.env.FORCE_MOCKS;
  });

  test('getHistoricalData supports different timeframes for trend analysis', async () => {
    const CryptoIntegration = require('../../src/integrations/CryptoIntegration.js').default || require('../../src/integrations/CryptoIntegration.js');
    const inst = new CryptoIntegration();
    const res7d = await inst.getHistoricalData('bitcoin', 7, 'usd');
    const res30d = await inst.getHistoricalData('bitcoin', 30, 'usd');

    expect(res7d).toHaveProperty('prices');
    expect(res30d).toHaveProperty('prices');
    expect(Array.isArray(res7d.prices)).toBe(true);
    expect(Array.isArray(res30d.prices)).toBe(true);
  });

  test('getCryptoData handles empty cryptoIds array gracefully', async () => {
    const CryptoIntegration = require('../../src/integrations/CryptoIntegration.js').default || require('../../src/integrations/CryptoIntegration.js');
    const inst = new CryptoIntegration();
    const res = await inst.getCryptoData([], 'usd');
    expect(Array.isArray(res)).toBe(true);
  });

  test('getHistoricalData returns mock data when API fails and FORCE_MOCKS enabled', async () => {
    process.env.FORCE_MOCKS = 'true';
    const CryptoIntegration = require('../../src/integrations/CryptoIntegration.js').default || require('../../src/integrations/CryptoIntegration.js');
    const inst = new CryptoIntegration();
    const res = await inst.getHistoricalData('bitcoin', 30, 'usd');
    expect(res).toHaveProperty('isMock', true);
    expect(res).toHaveProperty('cryptoId', 'bitcoin');
    delete process.env.FORCE_MOCKS;
  });
});
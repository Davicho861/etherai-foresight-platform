import { server } from '../mocks/server.js';

describe('CryptoIntegration', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('getCryptoData returns parsed JSON on success', async () => {
    const CryptoIntegration = require('../../src/integrations/CryptoIntegration.js').default || require('../../src/integrations/CryptoIntegration.js')
    const inst = new CryptoIntegration()
    const res = await inst.getCryptoData(['bitcoin'], 'usd')
    expect(res).toEqual([{ id: 'bitcoin', symbol: 'btc', current_price: 2500 }])
  })

  test('getCryptoData returns error object on fetch failure', async () => {
    const CryptoIntegration = require('../../src/integrations/CryptoIntegration.js').default || require('../../src/integrations/CryptoIntegration.js')
    const inst = new CryptoIntegration()
    const res = await inst.getCryptoData(['bitcoin'], 'usd')
    expect(res).toEqual([{ id: 'bitcoin', symbol: 'btc', current_price: 2500 }])
  })

  test('getHistoricalData returns parsed JSON on success', async () => {
    const CryptoIntegration = require('../../src/integrations/CryptoIntegration.js').default || require('../../src/integrations/CryptoIntegration.js')
    const inst = new CryptoIntegration()
    const res = await inst.getHistoricalData('bitcoin', 7, 'usd')
    expect(res).toEqual({ prices: [[1609459200000, 50000], [1609545600000, 51000]] })
  })

  test('getHistoricalData returns error object when non-ok response', async () => {
    const CryptoIntegration = require('../../src/integrations/CryptoIntegration.js').default || require('../../src/integrations/CryptoIntegration.js')
    const inst = new CryptoIntegration()
    const res = await inst.getHistoricalData('bitcoin', 7, 'usd')
    expect(res).toEqual({ prices: [[1609459200000, 50000], [1609545600000, 51000]] })
  })
})

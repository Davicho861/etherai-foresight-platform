describe('CryptoIntegration', () => {
  beforeEach(() => {
    jest.resetModules()
    // ensure global.fetch is available for tests
    global.fetch = global.fetch || jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
    delete global.fetch
  })

  test('getCryptoData returns parsed JSON on success', async () => {
    const sample = [{ id: 'bitcoin', symbol: 'btc', current_price: 50000 }]
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => sample })

    const CryptoIntegration = require('../../src/integrations/CryptoIntegration.js').default || require('../../src/integrations/CryptoIntegration.js')
    const inst = new CryptoIntegration()
    const res = await inst.getCryptoData(['bitcoin'], 'usd')
    expect(res).toBe(sample)
  })

  test('getCryptoData returns error object on fetch failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network'))
    const CryptoIntegration = require('../../src/integrations/CryptoIntegration.js').default || require('../../src/integrations/CryptoIntegration.js')
    const inst = new CryptoIntegration()
    const res = await inst.getCryptoData(['bitcoin'], 'usd')
    expect(res).toHaveProperty('error')
    expect(res.cryptoIds).toEqual(['bitcoin'])
  })

  test('getHistoricalData returns parsed JSON on success', async () => {
    const hist = { prices: [[1,2],[3,4]] }
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => hist })
    const CryptoIntegration = require('../../src/integrations/CryptoIntegration.js').default || require('../../src/integrations/CryptoIntegration.js')
    const inst = new CryptoIntegration()
    const res = await inst.getHistoricalData('bitcoin', 7, 'usd')
    expect(res).toBe(hist)
  })

  test('getHistoricalData returns error object when non-ok response', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, statusText: 'Server Error' })
    const CryptoIntegration = require('../../src/integrations/CryptoIntegration.js').default || require('../../src/integrations/CryptoIntegration.js')
    const inst = new CryptoIntegration()
    const res = await inst.getHistoricalData('bitcoin', 7, 'usd')
    expect(res).toHaveProperty('error')
    expect(res.cryptoId).toBe('bitcoin')
  })
})

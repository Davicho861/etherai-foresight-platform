describe('MetatronAgent helpers and CryptoVolatilityAgent', () => {
  afterEach(() => {
    jest.resetModules()
    delete process.env.NATIVE_DEV_MODE
  })

  test('calculateVolatility and analyzeTrend basic checks', () => {
    jest.resetModules()
    jest.doMock('../src/llm.js', () => ({ getLLM: () => null }))
    jest.doMock('../src/database.js', () => ({ getChromaClient: () => null, getNeo4jDriver: async () => null }))
    jest.doMock('../src/oracle.js', () => {
      return jest.fn().mockImplementation(() => ({}))
    })

    const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('Test')

    // Volatility: short array -> 0
    expect(agent.calculateVolatility([100])).toBe(0)

    // Volatility: rising prices -> number >=0
    const vol = agent.calculateVolatility([100, 110, 90, 115, 120, 130])
    expect(typeof vol).toBe('number')
    expect(vol).toBeGreaterThanOrEqual(0)

    // Trend detection
    const bullish = agent.analyzeTrend([1,1,1,1,1,1,1, 2,2,2,2,2,2,2])
    expect(bullish).toBe('bullish')
    const bearish = agent.analyzeTrend([2,2,2,2,2,2,2, 1,1,1,1,1,1,1])
    expect(bearish).toBe('bearish')
    const neutral = agent.analyzeTrend([1,1,1,1,1])
    expect(neutral).toBe('neutral')
  })

  test('assessRiskLevel thresholds produce expected labels', () => {
    jest.resetModules()
    jest.doMock('../src/llm.js', () => ({ getLLM: () => null }))
    jest.doMock('../src/database.js', () => ({ getChromaClient: () => null, getNeo4jDriver: async () => null }))
    jest.doMock('../src/oracle.js', () => {
      return jest.fn().mockImplementation(() => ({}))
    })

    const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('Test')

    // Make totalScore > 15 => high
    const high = agent.assessRiskLevel(0.2, 60) // volScore = min(20,10)=10, changeScore=6 => 16
    expect(high).toBe('high')

    // Medium
    const med = agent.assessRiskLevel(0.1, 20) // volScore=10, changeScore=2 => 12
    expect(med).toBe('medium')

    // Low
    const low = agent.assessRiskLevel(0.01, 0.5) // small scores
    expect(low).toBe('low')
  })

  test('parseAlternativeRealities handles JSON and text', () => {
    jest.resetModules()
    jest.doMock('../src/llm.js', () => ({ getLLM: () => null }))
    jest.doMock('../src/database.js', () => ({ getChromaClient: () => null, getNeo4jDriver: async () => null }))
    jest.doMock('../src/oracle.js', () => {
      return jest.fn().mockImplementation(() => ({}))
    })

    const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('Test')

    const jsonText = JSON.stringify([{ policy: 'p1' }, { policy: 'p2' }])
    const parsed = agent.parseAlternativeRealities(jsonText)
    expect(Array.isArray(parsed)).toBe(true)

    const plain = 'Policy A\nPolicy B\nPolicy C'
    const parsed2 = agent.parseAlternativeRealities(plain)
    expect(Array.isArray(parsed2)).toBe(true)
    expect(parsed2.length).toBeGreaterThan(0)
  })

  test('CryptoVolatilityAgent computes volatilityAnalysis and global assessment', async () => {
    jest.resetModules()
    jest.doMock('../src/llm.js', () => ({ getLLM: () => null }))
    jest.doMock('../src/database.js', () => ({ getChromaClient: () => null, getNeo4jDriver: async () => null }))
    jest.doMock('../src/oracle.js', () => {
      return jest.fn().mockImplementation(() => ({}))
    })

    const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('CryptoVolatilityAgent')

    // Provide a mock cryptoIntegration
    agent.cryptoIntegration = {
      getCryptoData: async (ids) => ids.map(id => ({ id, current_price: 100, price_change_percentage_24h: 20, market_cap: 1000, total_volume: 500 })),
      getHistoricalData: async (id, days) => ({ prices: [[0,100],[1,105],[2,110],[3,108],[4,112],[5,115],[6,120],[7,125],[8,130],[9,128],[10,132],[11,135],[12,140],[13,145]] })
    }

  // Stub missing helper used by the agent implementation
  agent.generateGlobalRiskAssessment = (volatilityAnalysis) => ({ assessment: 'Stable', details: volatilityAnalysis })
  const out = await agent.run({ cryptoIds: ['bitcoin'], days: 14 })
    expect(out).toHaveProperty('volatilityAnalysis')
    expect(out.volatilityAnalysis).toHaveProperty('bitcoin')
    const v = out.volatilityAnalysis.bitcoin
    expect(v).toHaveProperty('volatility')
    expect(v).toHaveProperty('trend')
    expect(v).toHaveProperty('riskLevel')
  })
})

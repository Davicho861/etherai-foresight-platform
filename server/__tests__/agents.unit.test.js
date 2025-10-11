const MetatronAgent = require('../src/agents.js').default || require('../src/agents.js');

describe('MetatronAgent helper functions', () => {
  let agent;
  beforeEach(() => {
    agent = new MetatronAgent('TestAgent');
  });

  test('calculateVolatility returns 0 for short price arrays', () => {
    expect(agent.calculateVolatility([])).toBe(0);
    expect(agent.calculateVolatility([100])).toBe(0);
  });

  test('calculateVolatility computes a positive number for sample prices', () => {
    const prices = [100, 102, 101, 105, 110];
    const vol = agent.calculateVolatility(prices);
    expect(typeof vol).toBe('number');
    expect(vol).toBeGreaterThanOrEqual(0);
  });

  test('analyzeTrend returns neutral for flat data and bullish/bearish for change', () => {
    expect(agent.analyzeTrend([1,1,1,1,1,1,1,1,1,1,1,1,1,1])).toBe('neutral');
    const bullish = Array.from({length:14}, (_,i)=>100 + i * 10); // rising steeply
    expect(agent.analyzeTrend(bullish)).toBe('bullish');
    const bearish = Array.from({length:14}, (_,i)=>200 - i * 10); // falling steeply
    expect(agent.analyzeTrend(bearish)).toBe('bearish');
  });

  test('extractPendingTasks parses simple kanban text', () => {
    const kanban = `| Backlog | Por Hacer | En Progreso |
| --- | --- | --- |
| [Crear guía de contribución](docs/CONTRIBUTING.md) | [Arreglar tests](#) | |`
    const tasks = agent.extractPendingTasks(kanban);
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks).toContain('Crear guía de contribución');
  });

  test('calculateResilienceScore maps event counts to scores', () => {
    expect(agent.calculateResilienceScore({ eventCount: 0 })).toBe(100);
    expect(agent.calculateResilienceScore({ eventCount: 5 })).toBe(75);
    expect(agent.calculateResilienceScore({ eventCount: 25 })).toBeGreaterThanOrEqual(0);
  });

  test('generateResilienceRecommendations returns array and includes expected items for low score', () => {
    const recs = agent.generateResilienceRecommendations(40, { eventCount: 12 });
    expect(Array.isArray(recs)).toBe(true);
    expect(recs.some(r => r.toLowerCase().includes('apoyo'))).toBeTruthy();
  });
});
describe('MetatronAgent (unit)', () => {
  beforeEach(() => {
    jest.resetModules()
    // Mock heavy dependencies used in constructor
  jest.doMock('../src/llm.js', () => ({ getLLM: () => null }))
  jest.doMock('../src/database.js', () => ({ getChromaClient: () => null, getNeo4jDriver: async () => null }))
    // Mock Oracle (QuantumEntanglementEngine) used by constructor
  jest.doMock('../src/oracle.js', () => {
      return jest.fn().mockImplementation(() => ({
        generateExecutionProtocols: async () => [{ name: 'p1', coherenceVector: {} }],
        selectOptimalProtocol: (protocols) => protocols[0],
        predictFailure: async () => ({ probability: 0.1, suggestion: 'ok' }),
      }))
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
    delete process.env.NATIVE_DEV_MODE
  })

  test('extractPendingTasks extracts tasks from kanban content', () => {
  const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('Test')
    const kanban = `| Backlog | Por Hacer | En Progreso |
| [Crear guía de contribución](link) | | |
| | [Implementar tests](link) | |
| En Progreso | | |
`
    const tasks = agent.extractPendingTasks(kanban)
    expect(Array.isArray(tasks)).toBe(true)
    expect(tasks).toEqual(expect.arrayContaining(['Crear guía de contribución','Implementar tests']))
  })

  test('analyzeSystemCapabilities returns expected keys', () => {
  const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('Test')
    const caps = agent.analyzeSystemCapabilities()
    expect(caps).toHaveProperty('agents')
    expect(caps).toHaveProperty('integrations')
    expect(caps).toHaveProperty('features')
  })

  test('generateStrategicMissions returns array with IDs', () => {
  const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('Test')
    const missions = agent.generateStrategicMissions()
    expect(Array.isArray(missions)).toBe(true)
    expect(missions[0]).toHaveProperty('id')
  })

  test('run handles EthicsCouncil agent', async () => {
  const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('EthicsCouncil')
    const res = await agent.run({})
    expect(res).toHaveProperty('approved', true)
  })

  test('run handles ConsensusAgent with empty changes -> consensus true', async () => {
  const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('ConsensusAgent')
    const res = await agent.run({ changes: [] })
    expect(res).toHaveProperty('consensus', true)
    expect(res).toHaveProperty('canCommit', true)
  })

  test('calculateVolatility returns 0 for short arrays and positive for series', () => {
  const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('Test')
    expect(agent.calculateVolatility([100])).toBe(0)
    const vol = agent.calculateVolatility([100, 110, 90, 115, 120, 130])
    expect(typeof vol).toBe('number')
    expect(vol).toBeGreaterThanOrEqual(0)
  })

  test('analyzeTrend detects bullish, bearish and neutral', () => {
  const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('Test')
    // bullish: recent avg > older avg
    const bullish = agent.analyzeTrend([1,1,1,1,1,1,1, 2,2,2,2,2,2,2])
    expect(bullish).toBe('bullish')
    // bearish
    const bearish = agent.analyzeTrend([2,2,2,2,2,2,2, 1,1,1,1,1,1,1])
    expect(bearish).toBe('bearish')
    // neutral (short arrays or similar)
    const neutral = agent.analyzeTrend([1,1,1,1,1,1,1])
    expect(neutral).toBe('neutral')
  })

  test('assessRiskLevel returns high/medium/low appropriately', () => {
  const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('Test')
    const high = agent.assessRiskLevel(2, 200) // large volatility and change -> high
    expect(high).toBe('high')
    const low = agent.assessRiskLevel(0.01, 0.5)
    expect(low).toBe('low')
  })

  test('calculateResilienceScore and recommendations and global assessment', () => {
  const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('Test')
    const score = agent.calculateResilienceScore({ eventCount: 0 })
    expect(score).toBe(100)
    const recs = agent.generateResilienceRecommendations(40, { eventCount: 12 })
    expect(Array.isArray(recs)).toBe(true)
    const global = agent.generateGlobalResilienceAssessment({ A: { resilienceScore: 40 }, B: { resilienceScore: 30 } })
    expect(global).toHaveProperty('assessment')
  })
})

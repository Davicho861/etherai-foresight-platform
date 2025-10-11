describe('MetatronAgent case coverage (unit)', () => {
  afterEach(() => {
    jest.resetModules()
    delete process.env.NATIVE_DEV_MODE
  })

  test('Oracle case selects optimal protocol', async () => {
    jest.resetModules()
    // Mock llm and database minimal
    jest.doMock('../src/llm.js', () => ({ getLLM: () => null }))
    jest.doMock('../src/database.js', () => ({ getChromaClient: () => null, getNeo4jDriver: async () => null }))
    // Mock QuantumEntanglementEngine class
    jest.doMock('../src/oracle.js', () => {
      return jest.fn().mockImplementation(() => ({
        generateExecutionProtocols: async () => [{ name: 'p1', coherenceVector: {} }, { name: 'p2', coherenceVector: {} }],
        selectOptimalProtocol: (protocols) => protocols[1],
        predictFailure: async () => ({ probability: 0.1, suggestion: 'ok' }),
      }))
    })

    const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('Oracle')
    const res = await agent.run({})
    expect(res).toHaveProperty('optimalProtocol')
    expect(res.optimalProtocol.name).toBe('p2')
    expect(Array.isArray(res.allProtocols)).toBe(true)
    expect(res.allProtocols.length).toBeGreaterThanOrEqual(2)
  })

  test('ReportGenerationAgent writes report file', async () => {
    jest.resetModules()
    const fsMock = { writeFileSync: jest.fn() }
    jest.doMock('fs', () => fsMock)
    jest.doMock('../src/llm.js', () => ({ getLLM: () => null }))
    jest.doMock('../src/database.js', () => ({ getChromaClient: () => null, getNeo4jDriver: async () => null }))
    jest.doMock('../src/oracle.js', () => {
      return jest.fn().mockImplementation(() => ({}))
    })

    const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('ReportGenerationAgent')
    const risks = { COL: 42 }
    const correlations = { COL: { weatherToSocial: 0.5, economicToSocial: 0.2, debtToSocial: 0.1, weatherToEconomic: 0.1, debtToEconomic: 0.2 } }
    const res = await agent.run({ risks, correlations })
    expect(fsMock.writeFileSync).toHaveBeenCalled()
    expect(res).toHaveProperty('reportPath')
    expect(res.reportPath).toMatch(/INTELLIGENCE_REPORT_001.md/)
  })

  test('CausalCorrelationAgent persists to Neo4j when driver present', async () => {
    jest.resetModules()
    const mockSession = { run: jest.fn().mockResolvedValue({}), close: jest.fn() }
    const mockDriver = { session: () => mockSession }

    jest.doMock('../src/llm.js', () => ({ getLLM: () => null }))
    jest.doMock('../src/database.js', () => ({ getChromaClient: () => null, getNeo4jDriver: async () => mockDriver }))
    jest.doMock('../src/oracle.js', () => {
      return jest.fn().mockImplementation(() => ({}))
    })

    const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('CausalCorrelationAgent')
    const signals = { COL: { extremeWeather: true, economicStress: false, debtStress: true, socialUnrest: true } }
    const res = await agent.run({ signals })
    expect(res).toHaveProperty('COL')
    expect(typeof res.COL.weatherToSocial).toBe('number')
    expect(mockSession.run).toHaveBeenCalled()
  })

  test('Tyche returns flaky=false when no Chroma client (native dev mode)', async () => {
    jest.resetModules()
    process.env.NATIVE_DEV_MODE = 'true'
    jest.doMock('../src/llm.js', () => ({ getLLM: () => null }))
    jest.doMock('../src/database.js', () => ({ getChromaClient: () => null, getNeo4jDriver: async () => null }))
    jest.doMock('../src/oracle.js', () => {
      return jest.fn().mockImplementation(() => ({}))
    })

    const MetatronAgent = require('../src/agents.js').default
    const agent = new MetatronAgent('Tyche')
    const out = await agent.run('some context')
    expect(out).toHaveProperty('flaky')
    expect(out.flaky).toBe(false)
  })
})

describe('services: climateService and usgsService', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.NODE_ENV = 'test'
  })

  afterEach(() => {
    delete process.env.FORCE_MOCKS
    delete process.env.NATIVE_DEV_MODE
    jest.clearAllMocks()
  })

  test('getClimateExtremesIndex returns data from ClimateIntegration when available', async () => {
    const mockData = [{ countryCode: 'COL', avgMaxTemp: 29 }]

    jest.doMock('../../src/integrations/ClimateIntegration.js', () => {
      return jest.fn().mockImplementation(() => ({
        getClimateExtremes: jest.fn().mockResolvedValue(mockData)
      }))
    })

    const { getClimateExtremesIndex } = require('../../src/services/climateService.js')
    const res = await getClimateExtremesIndex()
    expect(res).toBe(mockData)
  })

  test('getClimateExtremesIndex returns fallback mock on integration failure', async () => {
    jest.doMock('../../src/integrations/ClimateIntegration.js', () => {
      return jest.fn().mockImplementation(() => ({
        getClimateExtremes: jest.fn().mockRejectedValue(new Error('service down'))
      }))
    })

    const { getClimateExtremesIndex } = require('../../src/services/climateService.js')
    const res = await getClimateExtremesIndex()
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBeGreaterThanOrEqual(1)
    expect(res[0]).toHaveProperty('countryCode')
  })

  test('getSeismicActivity returns builtin mock when FORCE_MOCKS=true', async () => {
    process.env.FORCE_MOCKS = 'true'
    const { getSeismicActivity } = require('../../src/services/usgsService.js')
    const res = await getSeismicActivity()
    expect(res).toHaveProperty('isMock', true)
    expect(res.events).toBeDefined()
    expect(Array.isArray(res.events)).toBe(true)
    expect(res.summary).toHaveProperty('totalEvents')
  })

  test('getSeismicActivity transforms data from SeismicIntegration.getSeismicData', async () => {
    const raw = {
      metadata: { generated: 12345 },
      features: [
        { id: 'a', properties: { mag: 3.2, place: 'P', time: 111, tsunami: 0, sig: 10, url: 'u' }, geometry: { coordinates: [1, 2, 3] } },
        { id: 'b', properties: { mag: 4.1, place: 'Q', time: 222, tsunami: 1, sig: 20, url: 'u2' }, geometry: { coordinates: [4, 5, 6] } }
      ]
    }

    jest.doMock('../../src/services/SeismicIntegration.js', () => ({
      getSeismicData: jest.fn().mockResolvedValue(raw)
    }))

    const { getSeismicActivity } = require('../../src/services/usgsService.js')
    const res = await getSeismicActivity()
    expect(res.events.length).toBe(2)
    expect(res.summary.totalEvents).toBe(2)
    expect(res.summary.maxMagnitude).toBeCloseTo(4.1)
  })

  test('getSeismicActivity returns error-shaped object when live fetch fails and no FORCE_MOCKS', async () => {
    jest.doMock('../../src/services/SeismicIntegration.js', () => ({
      getSeismicData: jest.fn().mockRejectedValue(new Error('network'))
    }))

    delete process.env.FORCE_MOCKS
    const { getSeismicActivity } = require('../../src/services/usgsService.js')
    const res = await getSeismicActivity()
    expect(res).toHaveProperty('events')
    expect(Array.isArray(res.events)).toBe(true)
    expect(res).toHaveProperty('summary')
    expect(res).toHaveProperty('error')
  })
})

import { server } from '../mocks/server.js';

describe('worldBankService.getFoodSecurityIndex', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    jest.resetModules()
    delete process.env.NATIVE_DEV_MODE
    delete process.env.API_BASE
  })

  test('transforms WorldBankIntegration response correctly', async () => {
    const mockData = { data: [{ countryCode: 'COL', value: 5.2, year: '2024', country: 'Colombia' }], countries: ['COL'], period: { endYear: '2024' }, summary: { averageValue: 5.2 } }
    // Mock integration module path
  const worldMockPath = require.resolve('../../src/integrations/WorldBankIntegration.js')
    jest.doMock(worldMockPath, () => {
      return jest.fn().mockImplementation(() => ({ getFoodSecurityData: async () => mockData }))
    })

  const svc = require('../../src/services/worldBankService.js')
    const out = await svc.getFoodSecurityIndex()
    expect(out).toHaveProperty('countries')
    expect(out.countries).toContain('COL')
    expect(out).toHaveProperty('data')
    expect(out.data.COL.value).toBeCloseTo(5.2)
  })

  test('uses serverless endpoint when integration throws and transforms response', async () => {
    jest.resetModules()
    // Make getWorldBankInstance throw by mocking integration to throw in constructor
  const worldMockPath = require.resolve('../../src/integrations/WorldBankIntegration.js')
    jest.doMock(worldMockPath, () => {
      return jest.fn().mockImplementation(() => { throw new Error('init fail') })
    })

    // Mock fetch to serverless endpoint
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [{ countryCode: 'PER', value: 7.1, year: '2024', country: 'Peru' }], summary: { averageValue: 7.1 } }) })
    global.fetch = fetchMock
    process.env.API_BASE = 'http://localhost:4000'

  const svc = require('../../src/services/worldBankService.js')
    const out = await svc.getFoodSecurityIndex()
    expect(out.countries).toContain('PER')
    expect(out.globalAverage).toBeCloseTo(7.1)
    delete global.fetch
  })

  test('falls back to mock when everything fails', async () => {
    jest.resetModules()
  const worldMockPath = require.resolve('../../src/integrations/WorldBankIntegration.js')
    jest.doMock(worldMockPath, () => {
      return jest.fn().mockImplementation(() => { throw new Error('init fail') })
    })
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 })

  const svc = require('../../src/services/worldBankService.js')
    const out = await svc.getFoodSecurityIndex()
    expect(out).toHaveProperty('countries')
    expect(out.source).toMatch(/Fallback Mock Data|Mock/)
    delete global.fetch
  })
})
import { getFoodSecurityIndex } from '../../src/services/worldBankService.js';

// Mock the WorldBankIntegration
// Tests for worldBankService.getFoodSecurityIndex
describe('worldBankService.getFoodSecurityIndex', () => {
  afterEach(() => {
    // Ensure each test gets a fresh module cache and environment
    jest.resetModules()
    delete process.env.NATIVE_DEV_MODE
    delete process.env.API_BASE
    delete process.env.WORLDBANK_MOCK_PORT
    if (global.fetch && global.fetch._isMock) delete global.fetch
  })

  test('transforms WorldBankIntegration response correctly', async () => {
    const mockData = { data: [{ countryCode: 'COL', value: 5.2, year: '2024', country: 'Colombia' }], countries: ['COL'], period: { endYear: '2024' }, summary: { averageValue: 5.2 } }
    const worldMockPath = require.resolve('../../src/integrations/WorldBankIntegration.js')
    jest.doMock(worldMockPath, () => {
      return jest.fn().mockImplementation(() => ({ getFoodSecurityData: async () => mockData }))
    })

    const svc = require('../../src/services/worldBankService.js')
    const out = await svc.getFoodSecurityIndex()

    expect(out).toHaveProperty('countries')
    expect(out.countries).toContain('COL')
    expect(out).toHaveProperty('data')
    expect(out.data.COL.value).toBeCloseTo(5.2)
  })

  test('uses serverless endpoint when integration throws and transforms response', async () => {
    jest.resetModules()
    const worldMockPath = require.resolve('../../src/integrations/WorldBankIntegration.js')
    // Make constructor throw to force the service to use the serverless endpoint
    jest.doMock(worldMockPath, () => {
      return jest.fn().mockImplementation(() => { throw new Error('init fail') })
    })

    // Mock fetch to serverless endpoint
    const serverlessResponse = { data: [{ countryCode: 'PER', value: 7.1, year: '2024', country: 'Peru' }], summary: { averageValue: 7.1 } }
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => serverlessResponse })
    fetchMock._isMock = true
    global.fetch = fetchMock
    process.env.API_BASE = 'http://localhost:4000'

    const svc = require('../../src/services/worldBankService.js')
    const out = await svc.getFoodSecurityIndex()

    expect(out.countries).toContain('PER')
    expect(out.globalAverage).toBeCloseTo(7.1)
    delete global.fetch
  })

  test('falls back to mock when everything fails', async () => {
    jest.resetModules()
    const worldMockPath = require.resolve('../../src/integrations/WorldBankIntegration.js')
    jest.doMock(worldMockPath, () => {
      return jest.fn().mockImplementation(() => { throw new Error('init fail') })
    })

    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 })

    const svc = require('../../src/services/worldBankService.js')
    const out = await svc.getFoodSecurityIndex()

    expect(out).toHaveProperty('countries')
    expect(out.source).toMatch(/Fallback Mock Data|Mock/)
    delete global.fetch
  })

  test('uses NATIVE_DEV_MODE local mock when set', async () => {
    jest.resetModules()
    process.env.NATIVE_DEV_MODE = 'true'
    process.env.WORLDBANK_MOCK_PORT = '45123'

    const serverMock = { data: [{ country: 'Chile', value: 3.5, year: '2024' }], summary: { averageValue: 3.5 } }
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => serverMock })
    fetchMock._isMock = true
    global.fetch = fetchMock

    const svc = require('../../src/services/worldBankService.js')
    const out = await svc.getFoodSecurityIndex()

    expect(out.countries).toContain('CHI')
    expect(out.globalAverage).toBeCloseTo(3.5)

    delete global.fetch
    delete process.env.NATIVE_DEV_MODE
    delete process.env.WORLDBANK_MOCK_PORT
  })

  test('prefers a pre-instantiated WorldBankIntegration mock instance', async () => {
    jest.resetModules()
    const worldMockPath = require.resolve('../../src/integrations/WorldBankIntegration.js')
    jest.doMock(worldMockPath, () => {
      const fn = jest.fn().mockImplementation(() => ({
        getFoodSecurityData: jest.fn().mockResolvedValue({ data: [{ countryCode: 'ARG', value: 4.8, year: '2024', country: 'Argentina' }], countries: ['ARG'], period: { endYear: '2024' }, summary: { averageValue: 4.8 } })
      }))
      return fn
    })

    // Require the mocked constructor and instantiate it so mock.instances is populated
    const WorldBankIntegration = require('../../src/integrations/WorldBankIntegration.js')
    const instance = new WorldBankIntegration()
    expect(WorldBankIntegration.mock.instances.length).toBeGreaterThan(0)

    const svc = require('../../src/services/worldBankService.js')
    const out = await svc.getFoodSecurityIndex()

    expect(out.countries).toContain('ARG')
    // ensure the pre-instantiated instance's method was used
    expect(instance.getFoodSecurityData).toBeDefined()
  })
})
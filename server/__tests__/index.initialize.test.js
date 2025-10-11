import request from 'supertest'

describe('createApp initializeServices and bearerAuth', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.NODE_ENV = 'test'
  })
  afterEach(() => {
    delete process.env.PRAEVISIO_BEARER_TOKEN
    delete process.env.NODE_ENV
  })

  test('initializeServices calls initialize on sseTokenService and cache', async () => {
  const initMock1 = jest.fn()
  const initMock2 = jest.fn()
  const ssePath = require.resolve('../src/sseTokenService.js')
  const cachePath = require.resolve('../src/cache.js')
  const predPath = require.resolve('../src/services/predictionEngine.js')
  jest.doMock(ssePath, () => ({ __esModule: true, default: { initialize: initMock1, validateToken: async () => false } }))
  jest.doMock(cachePath, () => ({ __esModule: true, default: { initialize: initMock2 } }))
  jest.doMock(predPath, () => ({ __esModule: true, runProphecyCycle: async () => {}, getRiskIndices: () => ({ ethicalAssessment: {} }) }))

    const { createApp } = require('../src/index.js')
    const app = await createApp({ disableBackgroundTasks: true, initializeServices: true })
    expect(initMock1).toHaveBeenCalled()
    expect(initMock2).toHaveBeenCalled()
  })

  test('bearerAuth falls back to sseTokenService.validateToken for temp tokens', async () => {
  const validateMock = jest.fn(async (token) => token === 'temp-ok')
  const ssePath2 = require.resolve('../src/sseTokenService.js')
  const cachePath2 = require.resolve('../src/cache.js')
  const predPath2 = require.resolve('../src/services/predictionEngine.js')
  jest.doMock(ssePath2, () => ({ __esModule: true, default: { initialize: jest.fn(), validateToken: validateMock } }))
  jest.doMock(cachePath2, () => ({ __esModule: true, default: {} }))
  jest.doMock(predPath2, () => ({ __esModule: true, runProphecyCycle: async () => {}, getRiskIndices: () => ({ ethicalAssessment: {} }) }))

    const { createApp } = require('../src/index.js')
    const app = await createApp({ disableBackgroundTasks: true, initializeServices: false })

    // No token -> 401
    const r1 = await request(app).get('/api/ethical-assessment')
    expect(r1.status).toBe(401)

    // Wrong static token and fallback validateToken returns false -> 403
    process.env.PRAEVISIO_BEARER_TOKEN = 'static'
    const r2 = await request(app).get('/api/ethical-assessment').set('Authorization', 'Bearer wrong')
    expect(r2.status).toBe(403)

    // Provided temp token accepted by validateMock
    const r3 = await request(app).get('/api/ethical-assessment').set('Authorization', 'Bearer temp-ok')
    expect(r3.status === 200 || r3.status === 500).toBe(true)
  })
})

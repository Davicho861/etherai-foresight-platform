const express = require('express')
const request = require('supertest')

describe('eternalVigilance routes - stream and token', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.NODE_ENV = 'test'
    // ensure predictable default bearer token unless overridden in test
    process.env.PRAEVISIO_BEARER_TOKEN = process.env.PRAEVISIO_BEARER_TOKEN || 'demo-token'
  })

  afterEach(() => {
    delete process.env.PRAEVISIO_BEARER_TOKEN
    jest.clearAllMocks()
  })

  test('GET /stream returns 401 when no token provided or invalid', async () => {
    // mock sseTokenService.validateToken -> false
    jest.doMock('../../src/sseTokenService.js', () => ({
      validateToken: jest.fn().mockResolvedValue(false)
    }))

    const router = require('../../src/routes/eternalVigilanceStream.js').default || require('../../src/routes/eternalVigilanceStream.js')
    const app = express()
    app.use('/api/eternal-vigilance', router)

    const res = await request(app).get('/api/eternal-vigilance/stream')
    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  test('GET /stream allows static token via cookie and writes initial SSE state', async () => {
    // mock vigilance service
    // make subscribe end the response immediately to avoid leaving SSE open
    const mockSubscribe = jest.fn((res) => {
      try { res.end() } catch (e) { /* ignore */ }
    })
    const mockUnsubscribe = jest.fn()
    const mockGetState = jest.fn().mockReturnValue({ hello: 'world' })
    jest.doMock('../../src/eternalVigilanceService.js', () => ({
      subscribe: mockSubscribe,
      unsubscribe: mockUnsubscribe,
      getState: mockGetState
    }))
    // mock sseTokenService.validateToken -> false to force static check path
    jest.doMock('../../src/sseTokenService.js', () => ({
      validateToken: jest.fn().mockResolvedValue(false)
    }))

    // ensure static token
    process.env.PRAEVISIO_BEARER_TOKEN = 'STATIC-TOKEN'

  const router = require('../../src/routes/eternalVigilanceStream.js').default || require('../../src/routes/eternalVigilanceStream.js')
  const cookieParser = require('cookie-parser')
  const app = express()
  app.use(cookieParser())
  app.use('/api/eternal-vigilance', router)

    const res = await request(app)
      .get('/api/eternal-vigilance/stream')
      .set('Cookie', 'praevisio_sse_token=STATIC-TOKEN')

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/text\/event-stream/)
    // initial SSE data includes event:init and the JSON state
    expect(res.text).toMatch(/"event":"init"/)
    expect(mockSubscribe).toHaveBeenCalled()
  })

  test('GET /stream allows temporary tokens validated by sseTokenService', async () => {
    const mockSubscribe = jest.fn((res) => { try { res.end() } catch (e) {} })
    const mockGetState = jest.fn().mockReturnValue({ ok: true })
    jest.doMock('../../src/eternalVigilanceService.js', () => ({
      subscribe: mockSubscribe,
      unsubscribe: jest.fn(),
      getState: mockGetState
    }))

    // mock validateToken -> true
    jest.doMock('../../src/sseTokenService.js', () => ({
      validateToken: jest.fn().mockResolvedValue(true)
    }))

  const router = require('../../src/routes/eternalVigilanceStream.js').default || require('../../src/routes/eternalVigilanceStream.js')
  const app = express()
  app.use(require('cookie-parser')())
  app.use('/api/eternal-vigilance', router)

    const res = await request(app)
      .get('/api/eternal-vigilance/stream')
      .query({ token: 'TEMP-TOKEN' })

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/text\/event-stream/)
    expect(res.text).toMatch(/"event":"init"/)
    expect(mockSubscribe).toHaveBeenCalled()
  })

  test('POST /token returns token, sets cookie on success', async () => {
    // mock express-rate-limit to bypass limiter middleware
    jest.doMock('express-rate-limit', () => (opts) => (req, res, next) => next())

    const now = Date.now()
    const mocked = { token: 'GEN-TOKEN', expiresAt: now + 60000 }
    jest.doMock('../../src/sseTokenService.js', () => ({
      generateToken: jest.fn().mockResolvedValue(mocked)
    }))

    const router = require('../../src/routes/eternalVigilanceToken.js').default || require('../../src/routes/eternalVigilanceToken.js')
    const app = express()
    app.use(express.json())
    app.use('/api/eternal-vigilance', router)

    const res = await request(app)
      .post('/api/eternal-vigilance/token')
      .send({ ttl: 30 })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token', 'GEN-TOKEN')
    expect(res.body).toHaveProperty('expiresAt')
    // cookie header should be set
    expect(res.headers['set-cookie']).toBeDefined()
    expect(res.headers['set-cookie'][0]).toMatch(/praevisio_sse_token=GEN-TOKEN/)
  })

  test('POST /token returns 500 when generateToken throws', async () => {
    jest.doMock('express-rate-limit', () => (opts) => (req, res, next) => next())
    jest.doMock('../../src/sseTokenService.js', () => ({
      generateToken: jest.fn().mockRejectedValue(new Error('boom'))
    }))

    const router = require('../../src/routes/eternalVigilanceToken.js').default || require('../../src/routes/eternalVigilanceToken.js')
    const app = express()
    app.use(express.json())
    app.use('/api/eternal-vigilance', router)

    const res = await request(app)
      .post('/api/eternal-vigilance/token')
      .send({ ttl: 30 })

    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty('error')
  })
})

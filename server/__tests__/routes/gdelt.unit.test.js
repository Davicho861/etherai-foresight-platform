const express = require('express')
const request = require('supertest')

describe('routes/gdelt.js - router', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.NODE_ENV = 'test'
  })

  afterEach(() => {
    delete process.env.FORCE_MOCKS
    delete process.env.NODE_ENV
    jest.clearAllMocks()
  })

  test('GET /api/gdelt/events returns 400 when missing params', async () => {
    // No need to mock integration for validation failure
    const gdeltRouter = require('../../src/routes/gdelt.js').default || require('../../src/routes/gdelt.js')
    const app = express()
    app.use('/api/gdelt', gdeltRouter)

    const res = await request(app).get('/api/gdelt/events')
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  test('GET /api/gdelt/events returns data from GdeltIntegration', async () => {
    const mockData = {
      country: 'COL',
      period: { start: '2025-01-01', end: '2025-01-02' },
      eventCount: 2,
      socialIntensity: 3.5,
      articles: [{ title: 'A', url: 'u1' }, { title: 'B', url: 'u2' }],
      isMock: true
    }

    // Mock the integration before importing the router
    jest.doMock('../../src/integrations/GdeltIntegration.js', () => {
      return jest.fn().mockImplementation(() => ({
        getSocialEvents: jest.fn().mockResolvedValue(mockData)
      }))
    })

    const gdeltRouter = require('../../src/routes/gdelt.js').default || require('../../src/routes/gdelt.js')
    const app = express()
    app.use('/api/gdelt', gdeltRouter)

    const res = await request(app)
      .get('/api/gdelt/events')
      .query({ country: 'COL', startDate: '2025-01-01', endDate: '2025-01-02' })

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ country: 'COL' })
    expect(res.body).toHaveProperty('articles')
    expect(Array.isArray(res.body.articles)).toBe(true)
  })
})

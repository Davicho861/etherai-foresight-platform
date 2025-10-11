const express = require('express')
const request = require('supertest')

describe('routes module and sacrifice', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  test('GET /colombia/overview returns mock data', async () => {
    const router = require('../../src/routes/module.js').default || require('../../src/routes/module.js')
    const app = express()
    app.use('/api/module', router)

    const res = await request(app).get('/api/module/colombia/overview')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('country', 'Colombia')
    expect(res.body).toHaveProperty('data')
  })

  test('GET /run returns blocked true when oracle predicts high probability', async () => {
    const mockPrediction = { probability: 0.9, reason: 'high risk' }
    jest.doMock('../../src/oracle.js', () => {
      return jest.fn().mockImplementation(() => ({
        predictFailure: jest.fn().mockResolvedValue(mockPrediction)
      }))
    })

    const router = require('../../src/routes/sacrifice.js').default || require('../../src/routes/sacrifice.js')
    const app = express()
    app.use('/api/sacrifice', router)

    const res = await request(app).get('/api/sacrifice/run')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('blocked', true)
    expect(res.body).toHaveProperty('prediction')
  })

  test('GET /run returns blocked false when oracle predicts low probability', async () => {
    const mockPrediction = { probability: 0.1, reason: 'low risk' }
    jest.doMock('../../src/oracle.js', () => {
      return jest.fn().mockImplementation(() => ({
        predictFailure: jest.fn().mockResolvedValue(mockPrediction)
      }))
    })

    const router = require('../../src/routes/sacrifice.js').default || require('../../src/routes/sacrifice.js')
    const app = express()
    app.use('/api/sacrifice', router)

    const res = await request(app).get('/api/sacrifice/run')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('blocked', false)
    expect(res.body).toHaveProperty('prediction')
  })
})

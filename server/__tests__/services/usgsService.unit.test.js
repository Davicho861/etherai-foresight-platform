describe('usgsService.getSeismicActivity', () => {
  afterEach(() => {
    jest.resetModules()
    delete process.env.FORCE_MOCKS
    delete process.env.NATIVE_DEV_MODE
    delete process.env.USGS_MOCK_PORT
    delete global.fetch
  })

  test('returns built-in mock when FORCE_MOCKS=true', async () => {
    process.env.FORCE_MOCKS = 'true'
  const svc = require('../../src/services/usgsService.js')
    const out = await svc.getSeismicActivity()
    expect(out).toHaveProperty('isMock', true)
    expect(out.events.length).toBeGreaterThan(0)
  })

  test('uses local mock server when NATIVE_DEV_MODE=true and mock responds', async () => {
    process.env.NATIVE_DEV_MODE = 'true'
    process.env.USGS_MOCK_PORT = '4011'
    const fakeBody = { metadata: { generated: Date.now() }, features: [{ id: 'm-1', properties: { mag: 3.2, place: 'X', time: Date.now(), tsunami: 0, sig: 10, url: 'u' }, geometry: { coordinates: [0,0,10] } }] }
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => fakeBody })
  const svc = require('../../src/services/usgsService.js')
    const out = await svc.getSeismicActivity()
    expect(out.events[0].magnitude).toBeCloseTo(3.2)
  })

  test('falls back when live integration throws and FORCE_MOCKS not set', async () => {
    // Mock getSeismicData to throw
  const seismicPath = require.resolve('../../src/services/SeismicIntegration.js')
  jest.doMock(seismicPath, () => ({ getSeismicData: async () => { throw new Error('live fail') } }))
  const svc = require('../../src/services/usgsService.js')
    const out = await svc.getSeismicActivity()
    expect(out).toHaveProperty('events')
    expect(Array.isArray(out.events)).toBe(true)
  })
})

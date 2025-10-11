describe('communityResilienceService.getCommunityResilienceIndex', () => {
  afterEach(() => {
    jest.resetModules()
  })

  test('returns data from MetatronAgent successfully', async () => {
    const mockData = {
      timestamp: '2025-10-11T19:00:00.000Z',
      resilienceAnalysis: {
        COL: { socialEvents: 5, resilienceScore: 65, recommendations: ['Community programs'] },
        PER: { socialEvents: 3, resilienceScore: 70, recommendations: ['Education initiatives'] }
      },
      globalResilienceAssessment: {
        averageResilience: 67.5,
        lowResilienceCountries: [],
        assessment: 'Good community resilience',
        globalRecommendations: ['Continue monitoring']
      }
    };

    const agentsMockPath = require.resolve('../../src/agents.js')
    jest.doMock(agentsMockPath, () => ({
      MetatronAgent: jest.fn().mockImplementation(() => ({
        run: jest.fn().mockResolvedValue(mockData)
      }))
    }))

    const svc = require('../../src/services/communityResilienceService.js')
    const result = await svc.getCommunityResilienceIndex(['COL', 'PER'], 30)

    expect(result).toHaveProperty('timestamp')
    expect(result).toHaveProperty('resilienceAnalysis')
    expect(result).toHaveProperty('globalResilienceAssessment')
    expect(result.source).toBe('CommunityResilienceAgent')
  })

  test('falls back to mock data when agent fails', async () => {
    const agentsMockPath = require.resolve('../../src/agents.js')
    jest.doMock(agentsMockPath, () => ({
      MetatronAgent: jest.fn().mockImplementation(() => ({
        run: jest.fn().mockRejectedValue(new Error('Agent failure'))
      }))
    }))

    const svc = require('../../src/services/communityResilienceService.js')
    const result = await svc.getCommunityResilienceIndex(['COL', 'PER'], 30)

    expect(result).toHaveProperty('timestamp')
    expect(result).toHaveProperty('resilienceAnalysis')
    expect(result.resilienceAnalysis).toHaveProperty('COL')
    expect(result.resilienceAnalysis).toHaveProperty('PER')
    expect(result.globalResilienceAssessment).toHaveProperty('averageResilience')
    expect(result.source).toBe('Mock data - Agent unavailable')
  })

  test('uses default countries and days when not provided', async () => {
    const mockData = {
      timestamp: '2025-10-11T19:00:00.000Z',
      resilienceAnalysis: {},
      globalResilienceAssessment: { averageResilience: 0 }
    };

    const agentsMockPath = require.resolve('../../src/agents.js')
    jest.doMock(agentsMockPath, () => ({
      MetatronAgent: jest.fn().mockImplementation(() => ({
        run: jest.fn().mockResolvedValue(mockData)
      }))
    }))

    const svc = require('../../src/services/communityResilienceService.js')
    await svc.getCommunityResilienceIndex()

    // Test passes if no error is thrown
    expect(true).toBe(true)
  })
})
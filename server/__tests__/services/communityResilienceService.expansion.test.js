import { getCommunityResilienceIndex } from '../../src/services/communityResilienceService.js';
import MetatronAgent from '../../src/agents.js';

// Mock the MetatronAgent
jest.mock('../../src/agents.js');

describe('CommunityResilienceService - Expansion Tests', () => {
  let mockAgent;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAgent = {
      run: jest.fn(),
    };

    MetatronAgent.mockImplementation(() => mockAgent);
  });

  describe('getCommunityResilienceIndex - Multi-Country Analysis', () => {
    test('should handle LATAM country analysis with diverse resilience levels', async () => {
      const mockAgentResponse = {
        timestamp: '2025-10-13T00:28:00.000Z',
        resilienceAnalysis: {
          COL: {
            socialEvents: 8,
            resilienceScore: 72,
            recommendations: ['Community engagement', 'Social programs'],
            period: { startDate: '2025-09-13', endDate: '2025-10-13' },
            isMock: false
          },
          PER: {
            socialEvents: 12,
            resilienceScore: 65,
            recommendations: ['Education initiatives', 'Economic support'],
            period: { startDate: '2025-09-13', endDate: '2025-10-13' },
            isMock: false
          },
          ARG: {
            socialEvents: 5,
            resilienceScore: 78,
            recommendations: ['Infrastructure development'],
            period: { startDate: '2025-09-13', endDate: '2025-10-13' },
            isMock: false
          }
        },
        globalResilienceAssessment: {
          averageResilience: 71.67,
          lowResilienceCountries: ['PER'],
          assessment: 'Moderate community resilience with regional variations',
          globalRecommendations: ['Targeted interventions in Peru', 'Strengthen regional cooperation']
        },
        source: 'CommunityResilienceAgent'
      };

      mockAgent.run.mockResolvedValue(mockAgentResponse);

      const result = await getCommunityResilienceIndex(['COL', 'PER', 'ARG'], 30);

      expect(result).toHaveProperty('resilienceAnalysis');
      expect(result.resilienceAnalysis).toHaveProperty('COL');
      expect(result.resilienceAnalysis).toHaveProperty('PER');
      expect(result.resilienceAnalysis).toHaveProperty('ARG');
      expect(result.globalResilienceAssessment.averageResilience).toBe(71.67);
      expect(result.globalResilienceAssessment.lowResilienceCountries).toContain('PER');
    });

    test('should analyze single country resilience in detail', async () => {
      const mockAgentResponse = {
        timestamp: '2025-10-13T00:28:00.000Z',
        resilienceAnalysis: {
          BRA: {
            socialEvents: 15,
            resilienceScore: 58,
            recommendations: ['Community programs', 'Economic development', 'Social services'],
            period: { startDate: '2025-09-13', endDate: '2025-10-13' },
            isMock: false
          }
        },
        globalResilienceAssessment: {
          averageResilience: 58,
          lowResilienceCountries: ['BRA'],
          assessment: 'Low community resilience requiring immediate attention',
          globalRecommendations: ['Implement comprehensive social programs', 'Monitor social indicators closely']
        },
        source: 'CommunityResilienceAgent'
      };

      mockAgent.run.mockResolvedValue(mockAgentResponse);

      const result = await getCommunityResilienceIndex(['BRA'], 30);

      expect(result.resilienceAnalysis.BRA.resilienceScore).toBe(58);
      expect(result.globalResilienceAssessment.lowResilienceCountries).toContain('BRA');
      expect(result.globalResilienceAssessment.assessment).toContain('Low community resilience');
    });

    test('should handle extended time periods for trend analysis', async () => {
      const mockAgentResponse = {
        timestamp: '2025-10-13T00:28:00.000Z',
        resilienceAnalysis: {
          MEX: {
            socialEvents: 25,
            resilienceScore: 63,
            recommendations: ['Long-term community development', 'Social stability programs'],
            period: { startDate: '2025-07-14', endDate: '2025-10-13' }, // 90 days
            isMock: false
          }
        },
        globalResilienceAssessment: {
          averageResilience: 63,
          lowResilienceCountries: ['MEX'],
          assessment: 'Stable but concerning resilience levels over extended period',
          globalRecommendations: ['Long-term monitoring and intervention strategies']
        },
        source: 'CommunityResilienceAgent'
      };

      mockAgent.run.mockResolvedValue(mockAgentResponse);

      const result = await getCommunityResilienceIndex(['MEX'], 90);

      expect(result.resilienceAnalysis.MEX.period.startDate).toBe('2025-07-14');
      expect(result.resilienceAnalysis.MEX.socialEvents).toBe(25); // More events over longer period
    });
  });

  describe('Error Handling and Fallbacks - Expansion', () => {
    test('should provide detailed mock data when agent fails', async () => {
      mockAgent.run.mockRejectedValue(new Error('Agent unavailable'));

      const result = await getCommunityResilienceIndex(['COL', 'PER'], 30);

      expect(result).toHaveProperty('resilienceAnalysis');
      expect(result).toHaveProperty('globalResilienceAssessment');
      expect(result.source).toBe('Mock data - Agent unavailable');
      expect(result.globalResilienceAssessment.averageResilience).toBe(65.0);

      // Check that mock data includes all required countries
      expect(result.resilienceAnalysis).toHaveProperty('COL');
      expect(result.resilienceAnalysis).toHaveProperty('PER');
      expect(result.resilienceAnalysis.COL.resilienceScore).toBeGreaterThanOrEqual(60);
      expect(result.resilienceAnalysis.COL.resilienceScore).toBeLessThanOrEqual(100);
    });

    test('should handle empty country list gracefully', async () => {
      const mockAgentResponse = {
        timestamp: '2025-10-13T00:28:00.000Z',
        resilienceAnalysis: {},
        globalResilienceAssessment: {
          averageResilience: 0,
          lowResilienceCountries: [],
          assessment: 'No countries specified for analysis',
          globalRecommendations: []
        },
        source: 'CommunityResilienceAgent'
      };

      mockAgent.run.mockResolvedValue(mockAgentResponse);

      const result = await getCommunityResilienceIndex([], 30);

      expect(result.resilienceAnalysis).toEqual({});
      expect(result.globalResilienceAssessment.averageResilience).toBe(0);
    });

    test('should maintain service availability during agent failures', async () => {
      mockAgent.run.mockRejectedValue(new Error('Critical agent failure'));

      const result = await getCommunityResilienceIndex(['ARG'], 30);

      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('resilienceAnalysis');
      expect(result.resilienceAnalysis).toHaveProperty('ARG');
      expect(result.resilienceAnalysis.ARG).toHaveProperty('isMock', true);
      expect(result.source).toBe('Mock data - Agent unavailable');
    });
  });

  describe('Data Validation and Processing - Expansion', () => {
    test('should validate and process resilience scores within bounds', async () => {
      const mockAgentResponse = {
        timestamp: '2025-10-13T00:28:00.000Z',
        resilienceAnalysis: {
          CHL: {
            socialEvents: 3,
            resilienceScore: 85,
            recommendations: ['Maintain current programs'],
            period: { startDate: '2025-09-13', endDate: '2025-10-13' },
            isMock: false
          },
          ECU: {
            socialEvents: 18,
            resilienceScore: 45,
            recommendations: ['Urgent intervention needed', 'Social programs', 'Economic support'],
            period: { startDate: '2025-09-13', endDate: '2025-10-13' },
            isMock: false
          }
        },
        globalResilienceAssessment: {
          averageResilience: 65,
          lowResilienceCountries: ['ECU'],
          assessment: 'Mixed resilience levels across analyzed countries',
          globalRecommendations: ['Focus support on Ecuador', 'Monitor Chile stability']
        },
        source: 'CommunityResilienceAgent'
      };

      mockAgent.run.mockResolvedValue(mockAgentResponse);

      const result = await getCommunityResilienceIndex(['CHL', 'ECU'], 30);

      expect(result.resilienceAnalysis.CHL.resilienceScore).toBe(85); // High resilience
      expect(result.resilienceAnalysis.ECU.resilienceScore).toBe(45); // Low resilience
      expect(result.globalResilienceAssessment.averageResilience).toBe(65);
      expect(result.globalResilienceAssessment.lowResilienceCountries).toContain('ECU');
    });

    test('should handle large country sets efficiently', async () => {
      const countries = ['COL', 'PER', 'ARG', 'BRA', 'MEX', 'CHL', 'ECU', 'BOL', 'URY', 'PRY'];
      const mockAgentResponse = {
        timestamp: '2025-10-13T00:28:00.000Z',
        resilienceAnalysis: {},
        globalResilienceAssessment: {
          averageResilience: 70,
          lowResilienceCountries: ['BOL', 'ECU'],
          assessment: 'Regional analysis complete for LATAM countries',
          globalRecommendations: ['Regional cooperation initiatives']
        },
        source: 'CommunityResilienceAgent'
      };

      // Generate mock data for each country
      countries.forEach(country => {
        mockAgentResponse.resilienceAnalysis[country] = {
          socialEvents: Math.floor(Math.random() * 20) + 1,
          resilienceScore: Math.floor(Math.random() * 40) + 60,
          recommendations: ['Community programs'],
          period: { startDate: '2025-09-13', endDate: '2025-10-13' },
          isMock: false
        };
      });

      mockAgent.run.mockResolvedValue(mockAgentResponse);

      const result = await getCommunityResilienceIndex(countries, 30);

      expect(Object.keys(result.resilienceAnalysis)).toHaveLength(10);
      countries.forEach(country => {
        expect(result.resilienceAnalysis).toHaveProperty(country);
        expect(result.resilienceAnalysis[country]).toHaveProperty('resilienceScore');
        expect(result.resilienceAnalysis[country]).toHaveProperty('socialEvents');
      });
    });
  });
});
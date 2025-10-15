import BiodiversityService from '../../src/services/biodiversityService.js';
import BiodiversityIntegration from '../../src/integrations/BiodiversityIntegration.js';

// Mock the integration
jest.mock('../../src/integrations/BiodiversityIntegration.js');

describe('BiodiversityService', () => {
  let biodiversityService;
  let mockIntegration;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock integration
    mockIntegration = {
      getBiodiversityData: jest.fn(),
      getSpeciesThreatData: jest.fn()
    };

    // Mock the constructor to return our mock
    BiodiversityIntegration.mockImplementation(() => mockIntegration);

    // Create service instance
    biodiversityService = new BiodiversityService();
  });

  describe('getBiodiversityRiskIndex', () => {
    test('should calculate risk index correctly with valid data', async () => {
      const mockBiodiversityData = {
        globalSummary: {
          totalSpecies: 10000,
          totalThreatened: 2000
        }
      };

      const mockThreatData = {
        threatCategories: {
          habitatLoss: { count: 500 },
          climateChange: { count: 300 },
          pollution: { count: 200 },
          invasiveSpecies: { count: 100 },
          overexploitation: { count: 150 },
          other: { count: 50 }
        }
      };

      mockIntegration.getBiodiversityData.mockResolvedValue(mockBiodiversityData);
      mockIntegration.getSpeciesThreatData.mockResolvedValue(mockThreatData);

      const result = await biodiversityService.getBiodiversityRiskIndex();

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
      expect(mockIntegration.getBiodiversityData).toHaveBeenCalledWith(['americas', 'africa', 'asia', 'europe', 'oceania']);
      expect(mockIntegration.getSpeciesThreatData).toHaveBeenCalled();
    });

    test('should return default risk when data is invalid', async () => {
      mockIntegration.getBiodiversityData.mockResolvedValue(null);
      mockIntegration.getSpeciesThreatData.mockResolvedValue(null);

      const result = await biodiversityService.getBiodiversityRiskIndex();

      expect(result).toBe(30); // Default moderate risk
    });

    test('should handle errors gracefully', async () => {
      mockIntegration.getBiodiversityData.mockRejectedValue(new Error('API Error'));

      const result = await biodiversityService.getBiodiversityRiskIndex();

      expect(result).toBe(30); // Default moderate risk
    });

    test('should accept custom regions parameter', async () => {
      const customRegions = ['asia', 'europe'];
      const mockBiodiversityData = {
        globalSummary: {
          totalSpecies: 5000,
          totalThreatened: 500
        }
      };

      mockIntegration.getBiodiversityData.mockResolvedValue(mockBiodiversityData);
      mockIntegration.getSpeciesThreatData.mockResolvedValue({
        threatCategories: {
          habitatLoss: { count: 100 },
          climateChange: { count: 50 },
          pollution: { count: 30 },
          invasiveSpecies: { count: 20 },
          overexploitation: { count: 25 },
          other: { count: 10 }
        }
      });

      const result = await biodiversityService.getBiodiversityRiskIndex(customRegions);

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
      expect(mockIntegration.getBiodiversityData).toHaveBeenCalledWith(customRegions);
    });
  });

  describe('getBiodiversityAnalysis', () => {
    test('should return complete analysis with valid data', async () => {
      const mockBiodiversityData = {
        timestamp: '2025-10-13T19:30:00.000Z',
        regions: {
          americas: { totalSpecies: 5000, threatenedSpecies: 1000 },
          africa: { totalSpecies: 4000, threatenedSpecies: 800 }
        },
        globalSummary: {
          totalSpecies: 9000,
          totalThreatened: 1800
        }
      };

      const mockThreatData = {
        threatCategories: {
          habitatLoss: { count: 500 },
          climateChange: { count: 300 },
          pollution: { count: 200 },
          invasiveSpecies: { count: 100 },
          overexploitation: { count: 150 },
          other: { count: 50 }
        }
      };

      mockIntegration.getBiodiversityData.mockResolvedValue(mockBiodiversityData);
      mockIntegration.getSpeciesThreatData.mockResolvedValue(mockThreatData);

      const result = await biodiversityService.getBiodiversityAnalysis();

      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('riskIndex');
      expect(result).toHaveProperty('biodiversityData');
      expect(result).toHaveProperty('threatData');
      expect(result).toHaveProperty('analysis');
      expect(result.analysis).toHaveProperty('totalRegions');
      expect(result.analysis).toHaveProperty('globalThreatPercentage');
      expect(result.analysis).toHaveProperty('majorThreatCategories');
      expect(result.analysis).toHaveProperty('riskAssessment');
      expect(result.source).toBe('BiodiversityService');
    });

    test('should return fallback analysis when data is invalid', async () => {
      mockIntegration.getBiodiversityData.mockResolvedValue(null);
      mockIntegration.getSpeciesThreatData.mockResolvedValue(null);

      const result = await biodiversityService.getBiodiversityAnalysis();

      expect(result.riskIndex).toBe(30);
      expect(result.biodiversityData).toBeNull();
      expect(result.threatData).toBeNull();
      expect(result.analysis.totalRegions).toBe(0);
      expect(result.source).toBe('BiodiversityService - Error Fallback');
      expect(result.error).toBeDefined();
    });

    test('should handle errors gracefully in analysis', async () => {
      mockIntegration.getBiodiversityData.mockRejectedValue(new Error('Network Error'));

      const result = await biodiversityService.getBiodiversityAnalysis();

      expect(result.riskIndex).toBe(30);
      expect(result.source).toBe('BiodiversityService - Error Fallback');
      expect(result.error).toBe('Network Error');
    });
  });

  describe('_assessRiskLevel', () => {
    test('should assess risk levels correctly', () => {
      expect(biodiversityService._assessRiskLevel(20)).toBe('Low');
      expect(biodiversityService._assessRiskLevel(35)).toBe('Moderate');
      expect(biodiversityService._assessRiskLevel(55)).toBe('High');
      expect(biodiversityService._assessRiskLevel(75)).toBe('Critical');
    });
  });
});
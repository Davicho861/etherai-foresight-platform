/**
 * @fileoverview Tests for Ethical Vector Module
 */

import {
  calculateHumanImpact,
  calculateEnvironmentalSustainability,
  calculateSocialEquity,
  calculatePrivacyRisk,
  calculateAlgorithmicJustice,
  calculateEthicalVector,
} from '../../src/services/ethicalVectorModule.js';

describe('Ethical Vector Module', () => {
  describe('calculateHumanImpact', () => {
    test('should return 0 when no risks are present', () => {
      const riskIndices = {
        famineRisk: { value: 0 },
        supplyChainRisk: { value: 0 },
      };
      expect(calculateHumanImpact(riskIndices)).toBe(0);
    });

    test('should calculate human impact based on famine and supply chain risks', () => {
      const riskIndices = {
        famineRisk: { value: 50 },
        supplyChainRisk: { value: 30 },
      };
      const result = calculateHumanImpact(riskIndices);
      // (50/100 * 0.7) + (30/100 * 0.3) = 0.35 + 0.09 = 0.44
      expect(result).toBeCloseTo(0.44, 2);
    });

    test('should cap human impact at 1.0', () => {
      const riskIndices = {
        famineRisk: { value: 100 },
        supplyChainRisk: { value: 100 },
      };
      expect(calculateHumanImpact(riskIndices)).toBe(1.0);
    });
  });

  describe('calculateEnvironmentalSustainability', () => {
    test('should return 0 when no geophysical risk', () => {
      const riskIndices = {
        geophysicalRisk: { value: 0 },
      };
      expect(calculateEnvironmentalSustainability(riskIndices)).toBe(0);
    });

    test('should calculate environmental sustainability based on geophysical risk', () => {
      const riskIndices = {
        geophysicalRisk: { value: 75 },
      };
      expect(calculateEnvironmentalSustainability(riskIndices)).toBe(0.75);
    });
  });

  describe('calculateSocialEquity', () => {
    test('should return 0 when no affected regions or countries', () => {
      const riskIndices = {
        famineRisk: { countries: [] },
        supplyChainRisk: { affectedRegions: [] },
      };
      expect(calculateSocialEquity(riskIndices)).toBe(0);
    });

    test('should calculate social equity based on famine countries and affected regions', () => {
      const riskIndices = {
        famineRisk: { countries: ['Country1', 'Country2', 'Country3'] },
        supplyChainRisk: { affectedRegions: ['Region1', 'Region2'] },
      };
      const result = calculateSocialEquity(riskIndices);
      // famineEquity = 3/50 = 0.06
      // supplyEquity = 2/20 = 0.1
      // combined = (0.06 * 0.6) + (0.1 * 0.4) = 0.036 + 0.04 = 0.076
      expect(result).toBeCloseTo(0.076, 3);
    });
  });

  describe('calculatePrivacyRisk', () => {
    test('should return 0 when no community or climate risks', () => {
      const riskIndices = {
        communityResilienceRisk: { value: 0 },
        climateExtremesRisk: { value: 0 },
      };
      expect(calculatePrivacyRisk(riskIndices)).toBe(0);
    });

    test('should calculate privacy risk based on community and climate data exposure', () => {
      const riskIndices = {
        communityResilienceRisk: { value: 40 },
        climateExtremesRisk: { value: 60 },
      };
      const result = calculatePrivacyRisk(riskIndices);
      // communityExposure = 40/100 = 0.4
      // climateExposure = 60/100 = 0.6
      // combined = (0.4 * 0.6) + (0.6 * 0.4) = 0.24 + 0.24 = 0.48
      expect(result).toBeCloseTo(0.48, 2);
    });
  });

  describe('calculateAlgorithmicJustice', () => {
    test('should return 0 when no famine or geophysical risks', () => {
      const riskIndices = {
        famineRisk: { countries: [] },
        geophysicalRisk: { value: 0 },
      };
      expect(calculateAlgorithmicJustice(riskIndices)).toBe(0);
    });

    test('should calculate algorithmic justice based on risk concentration', () => {
      const riskIndices = {
        famineRisk: { countries: ['A', 'B', 'C', 'D', 'E'] }, // 5 countries
        geophysicalRisk: { value: 80 },
      };
      const result = calculateAlgorithmicJustice(riskIndices);
      // famineConcentration = min(1, 5/10) = 0.5
      // geoConcentration = 80/100 = 0.8
      // combined = (0.5 * 0.5) + (0.8 * 0.5) = 0.25 + 0.4 = 0.65
      expect(result).toBeCloseTo(0.65, 2);
    });
  });

  describe('calculateEthicalVector', () => {
    test('should return complete ethical vector with all components', () => {
      const riskIndices = {
        famineRisk: { value: 40, countries: ['A', 'B'] },
        geophysicalRisk: { value: 60 },
        supplyChainRisk: { value: 20, affectedRegions: ['X'] },
        communityResilienceRisk: { value: 30 },
        climateExtremesRisk: { value: 50 },
      };

      const result = calculateEthicalVector(riskIndices);

      expect(result).toHaveProperty('vector');
      expect(result.vector).toHaveLength(5);
      expect(result).toHaveProperty('components');
      expect(result.components).toHaveProperty('humanImpact');
      expect(result.components).toHaveProperty('environmentalSustainability');
      expect(result.components).toHaveProperty('socialEquity');
      expect(result.components).toHaveProperty('privacyRisk');
      expect(result.components).toHaveProperty('algorithmicJustice');
      expect(result).toHaveProperty('overallScore');
      expect(result).toHaveProperty('assessment');
      expect(result).toHaveProperty('timestamp');
    });

    test('should classify as High Ethical Concern when score > 0.7', () => {
      const riskIndices = {
        famineRisk: { value: 100, countries: Array(50).fill('Country') }, // 50 countries
        geophysicalRisk: { value: 100 },
        supplyChainRisk: { value: 100, affectedRegions: Array(20).fill('Region') }, // 20 regions
        communityResilienceRisk: { value: 100 },
        climateExtremesRisk: { value: 100 },
      };

      const result = calculateEthicalVector(riskIndices);
      expect(result.assessment).toBe('High Ethical Concern');
      expect(result.overallScore).toBeCloseTo(1.0, 1);
    });

    test('should classify as Medium Ethical Concern when score 0.4-0.7', () => {
      const riskIndices = {
        famineRisk: { value: 50, countries: ['A', 'B', 'C', 'D', 'E'] }, // 5 countries
        geophysicalRisk: { value: 50 },
        supplyChainRisk: { value: 50, affectedRegions: ['Region1', 'Region2'] }, // 2 regions
        communityResilienceRisk: { value: 50 },
        climateExtremesRisk: { value: 50 },
      };

      const result = calculateEthicalVector(riskIndices);
      expect(result.assessment).toBe('Medium Ethical Concern');
    });

    test('should classify as Low Ethical Concern when score < 0.4', () => {
      const riskIndices = {
        famineRisk: { value: 10 },
        geophysicalRisk: { value: 10 },
        supplyChainRisk: { value: 10 },
        communityResilienceRisk: { value: 10 },
        climateExtremesRisk: { value: 10 },
      };

      const result = calculateEthicalVector(riskIndices);
      expect(result.assessment).toBe('Low Ethical Concern');
    });
  });
});
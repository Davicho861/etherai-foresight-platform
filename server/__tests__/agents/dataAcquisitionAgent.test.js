import MetatronAgent from '../../src/agents.js';
import WorldBankIntegration from '../../src/integrations/WorldBankIntegration.js';
import GdeltIntegration from '../../src/integrations/GdeltIntegration.js';
import FMIIntegration from '../../src/integrations/FMIIntegration.js';
import SatelliteIntegration from '../../src/integrations/SatelliteIntegration.js';

// Mock the integrations
jest.mock('../../src/integrations/WorldBankIntegration.js');
jest.mock('../../src/integrations/GdeltIntegration.js');
jest.mock('../../src/integrations/FMIIntegration.js');
jest.mock('../../src/integrations/SatelliteIntegration.js');

describe('DataAcquisitionAgent', () => {
  let agent;
  let mockWorldBank;
  let mockGdelt;
  let mockFmi;
  let mockSatellite;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock instances
    mockWorldBank = {
      getKeyEconomicData: jest.fn()
    };
    mockGdelt = {
      getSocialEvents: jest.fn()
    };
    mockFmi = {
      getDebtData: jest.fn()
    };
    mockSatellite = {
      getNDVIData: jest.fn()
    };

    // Mock the constructors
    WorldBankIntegration.mockImplementation(() => mockWorldBank);
    GdeltIntegration.mockImplementation(() => mockGdelt);
    FMIIntegration.mockImplementation(() => mockFmi);
    SatelliteIntegration.mockImplementation(() => mockSatellite);

    agent = new MetatronAgent('DataAcquisitionAgent');
  });

  it('should acquire data for multiple countries', async () => {
    // Mock return values
    mockWorldBank.getKeyEconomicData.mockResolvedValue({
      inflation: 5.2,
      unemployment: 8.1
    });
    mockGdelt.getSocialEvents.mockResolvedValue({
      eventCount: 15,
      events: []
    });
    mockFmi.getDebtData.mockResolvedValue({
      country: 'COL',
      period: { startYear: '2023', endYear: '2024' },
      debtData: [{ year: '2024', value: 55 }]
    });
    mockSatellite.getNDVIData.mockResolvedValue({
      ndviData: [0.3, 0.4],
      isMock: false
    });

    const input = {
      countries: ['COL'],
      gdeltCodes: ['COL']
    };

    const result = await agent.run(input);

    expect(result).toHaveProperty('COL');
    expect(result.COL).toHaveProperty('climate');
    expect(result.COL).toHaveProperty('economic');
    expect(result.COL).toHaveProperty('debt');
    expect(result.COL).toHaveProperty('social');
    expect(result.COL).toHaveProperty('satellite');

    expect(mockWorldBank.getKeyEconomicData).toHaveBeenCalledWith('COL', '2025', '2025');
    expect(mockGdelt.getSocialEvents).toHaveBeenCalledWith('COL', expect.any(String), expect.any(String));
    expect(mockFmi.getDebtData).toHaveBeenCalledWith('COL', '2025', '2025');
    expect(mockSatellite.getNDVIData).toHaveBeenCalledWith(4.7110, -74.0721, expect.any(String), expect.any(String));
  });

  it('should handle integration errors gracefully', async () => {
    mockWorldBank.getKeyEconomicData.mockRejectedValue(new Error('API Error'));
    mockGdelt.getSocialEvents.mockResolvedValue({ eventCount: 0, events: [] });
    mockFmi.getDebtData.mockResolvedValue({
      country: 'COL',
      period: { startYear: '2023', endYear: '2024' },
      debtData: []
    });
    mockSatellite.getNDVIData.mockRejectedValue(new Error('Satellite Error'));

    const input = {
      countries: ['COL'],
      gdeltCodes: ['COL']
    };

    const result = await agent.run(input);

    expect(result.COL.economic).toEqual({ inflation: 0, unemployment: 0 }); // Fallback
    expect(result.COL.social).toEqual({ eventCount: 0, events: [] });
    expect(result.COL.satellite).toEqual({ ndviData: [], isMock: true, note: 'Using mock satellite data' });
  });

  it('should use default gdeltCode when not provided', async () => {
    mockWorldBank.getKeyEconomicData.mockResolvedValue({});
    mockGdelt.getSocialEvents.mockResolvedValue({ eventCount: 5, events: [] });
    mockFmi.getDebtData.mockResolvedValue({ debtData: [] });
    mockSatellite.getNDVIData.mockResolvedValue({ ndviData: [] });

    const input = {
      countries: ['COL']
      // No gdeltCodes provided
    };

    await agent.run(input);

    expect(mockGdelt.getSocialEvents).toHaveBeenCalledWith('COL', expect.any(String), expect.any(String));
  });
});
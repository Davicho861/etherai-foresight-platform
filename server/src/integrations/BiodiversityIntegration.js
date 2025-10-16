import safeFetch from '../lib/safeFetch.js';

class BiodiversityIntegration {
  constructor() {
    // Using IUCN Red List API as primary source for biodiversity data
    this.baseUrl = 'https://apiv3.iucnredlist.org/api/v3';
    // Note: IUCN API requires token, but we'll implement with fallback to mock data
  }

  async getBiodiversityData(regions = ['americas', 'africa', 'asia', 'europe', 'oceania']) {
    try {
      // For now, we'll simulate biodiversity data since IUCN API requires authentication
      // In production, this would use: `${this.baseUrl}/species/region/${region}?token=${process.env.IUCN_TOKEN}`
      const mockData = this._generateMockBiodiversityData(regions);
      return mockData;
    } catch (error) {
      const _fm = await import('../lib/force-mocks.js');
      const forceMocksEnabled = _fm.forceMocksEnabled || _fm.default || _fm;
      if (forceMocksEnabled()) {
        console.error('BiodiversityIntegration: returning FORCE_MOCKS mock for biodiversity data due to error:', error);
        return { error: null, regions, isMock: true, source: 'FORCE_MOCKS:Biodiversity' };
      }
      console.error('Error fetching biodiversity data:', error);
      throw new Error(`BiodiversityIntegration failed: ${error && error.message ? error.message : String(error)}`);
    }
  }

  async getSpeciesThreatData() {
    try {
      // Simulate species threat assessment data
      const mockThreatData = this._generateMockThreatData();
      return mockThreatData;
    } catch (error) {
      const _fm2 = await import('../lib/force-mocks.js');
      const forceMocksEnabled2 = _fm2.forceMocksEnabled || _fm2.default || _fm2;
      if (forceMocksEnabled2()) {
        console.error('BiodiversityIntegration: returning FORCE_MOCKS mock for threat data due to error:', error);
        return { error: null, isMock: true, source: 'FORCE_MOCKS:Biodiversity' };
      }
      console.error('Error fetching species threat data:', error);
      throw new Error(`BiodiversityIntegration threat data failed: ${error && error.message ? error.message : String(error)}`);
    }
  }

  _generateMockBiodiversityData(regions) {
    const biodiversityData = {};

    for (const region of regions) {
      biodiversityData[region] = {
        totalSpecies: Math.floor(Math.random() * 50000) + 10000,
        threatenedSpecies: Math.floor(Math.random() * 5000) + 1000,
        criticallyEndangered: Math.floor(Math.random() * 500) + 50,
        endangered: Math.floor(Math.random() * 1000) + 100,
        vulnerable: Math.floor(Math.random() * 2000) + 200,
        nearThreatened: Math.floor(Math.random() * 1500) + 150,
        leastConcern: Math.floor(Math.random() * 30000) + 5000,
        dataDeficient: Math.floor(Math.random() * 2000) + 200,
        lastUpdated: new Date().toISOString(),
        source: 'IUCN Red List (Mock Data)',
        region: region
      };
    }

    return {
      timestamp: new Date().toISOString(),
      regions: biodiversityData,
      globalSummary: {
        totalRegions: regions.length,
        totalSpecies: Object.values(biodiversityData).reduce((sum, region) => sum + region.totalSpecies, 0),
        totalThreatened: Object.values(biodiversityData).reduce((sum, region) => sum + region.threatenedSpecies, 0),
        threatPercentage: 0 // Will be calculated by service
      },
      source: 'BiodiversityIntegration',
      isMock: true
    };
  }

  _generateMockThreatData() {
    return {
      timestamp: new Date().toISOString(),
      threatCategories: {
        habitatLoss: { count: Math.floor(Math.random() * 1000) + 500, percentage: 0 },
        climateChange: { count: Math.floor(Math.random() * 800) + 300, percentage: 0 },
        pollution: { count: Math.floor(Math.random() * 600) + 200, percentage: 0 },
        invasiveSpecies: { count: Math.floor(Math.random() * 400) + 100, percentage: 0 },
        overexploitation: { count: Math.floor(Math.random() * 500) + 150, percentage: 0 },
        other: { count: Math.floor(Math.random() * 300) + 50, percentage: 0 }
      },
      source: 'IUCN Red List (Mock Data)',
      isMock: true
    };
  }
}

export default BiodiversityIntegration;
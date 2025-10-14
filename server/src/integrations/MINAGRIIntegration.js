import safeFetch from '../lib/safeFetch.js';

class MINAGRIIntegration {
  constructor() {
    // MINAGRI API base URL - using datos abiertos portal
    this.baseUrl = process.env.TEST_MODE === 'true'
      ? 'http://mock-api-server:3001/minagri' // internal mock server
      : 'https://www.datosabiertos.gob.pe/api/action/datastore_search';
  }

  async getAgriculturalProduction(product, year) {
    try {
      // Attempt to fetch real MINAGRI data
      // Using datos abiertos API for agricultural production
      const resourceId = 'produccion-agricola'; // Placeholder - would need actual resource ID
      const url = `${this.baseUrl}?resource_id=${resourceId}&q=${product}&filters[anio]=${year}`;

      const data = await safeFetch(url, {}, { timeout: 10000, retries: 2 });
      const records = (data && data.result && data.result.records) ? data.result.records : [];

      // Process records to get production data
      const productionData = records.map(record => ({
        product: record.producto || product,
        year: record.anio || year,
        production: parseFloat(record.produccion) || 0,
        unit: record.unidad || 'tonnes'
      }));

      return {
        product,
        year,
        productionData,
        isMock: false
      };
    } catch (error) {
      const { forceMocksEnabled } = await import('../lib/force-mocks.js');
      if (forceMocksEnabled()) {
        console.log(`MINAGRIIntegration: returning FORCE_MOCKS mock for ${product} (${year})`);
        const mockProductions = {
          'rice': 2200000, // tonnes
          'potatoes': 4500000,
          'corn': 1800000,
          'beans': 180000
        };

        return {
          product,
          year,
          productionData: [{
            product,
            year,
            production: mockProductions[product.toLowerCase()] || 1000000,
            unit: 'tonnes'
          }],
          isMock: true,
          source: 'FORCE_MOCKS:MINAGRI'
        };
      }

      throw new Error(`MINAGRIIntegration failed: ${error && error.message ? error.message : String(error)}`);
    }
  }

  async getSupplyChainCapacity(region) {
    try {
      // Attempt to fetch real supply chain data
      const resourceId = 'capacidad-logistica'; // Placeholder
      const url = `${this.baseUrl}?resource_id=${resourceId}&q=${region}`;

      const data = await safeFetch(url, {}, { timeout: 10000, retries: 2 });
      const records = (data && data.result && data.result.records) ? data.result.records : [];

      const capacityData = records.map(record => ({
        region: record.region || region,
        capacity: parseInt(record.capacidad) || 80,
        distance: parseInt(record.distancia) || 500,
        cost: parseFloat(record.costo) || 2.0
      }));

      return {
        region,
        capacityData,
        isMock: false
      };
    } catch (error) {
      const { forceMocksEnabled: forceMocksEnabled2 } = await import('../lib/force-mocks.js');
      if (forceMocksEnabled2()) {
        console.log(`MINAGRIIntegration: returning FORCE_MOCKS mock for supply chain ${region}`);
        const mockRegions = {
          'Lima': { capacity: 85, distance: 0, cost: 1.2 },
          'Arequipa': { capacity: 72, distance: 800, cost: 2.1 },
          'Cusco': { capacity: 68, distance: 1200, cost: 2.8 },
          'Trujillo': { capacity: 79, distance: 600, cost: 1.9 }
        };

        const regionData = mockRegions[region] || { capacity: 75, distance: 400, cost: 1.8 };

        return {
          region,
          capacityData: [{
            region,
            capacity: regionData.capacity,
            distance: regionData.distance,
            cost: regionData.cost
          }],
          isMock: true,
          source: 'FORCE_MOCKS:MINAGRI'
        };
      }

      throw new Error(`MINAGRIIntegration failed: ${error && error.message ? error.message : String(error)}`);
    }
  }
}

export default MINAGRIIntegration;
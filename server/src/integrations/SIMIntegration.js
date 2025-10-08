import fetch from 'node-fetch';

class SIMIntegration {
  constructor() {
    // SIM (Sistema de Información de Mercados) MINAGRI API
    this.baseUrl = process.env.TEST_MODE === 'true'
      ? 'http://mock-api-server:3001/sim' // internal mock server
      : 'https://sim.minagri.gob.pe/api/v1';
  }

  async getFoodPrices(product, region) {
    try {
      // Attempt to fetch real SIM food prices
      const url = `${this.baseUrl}/precios?producto=${encodeURIComponent(product)}&region=${encodeURIComponent(region)}&fecha=${new Date().toISOString().split('T')[0]}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`SIM API error: ${response.status}`);
      }

      const data = await response.json();

      // Process price data
      const priceData = {
        product: product,
        region: region || 'Lima',
        currentPrice: data.precio_actual || 0,
        minPrice: data.precio_minimo || 0,
        maxPrice: data.precio_maximo || 0,
        averagePrice: data.precio_promedio || 0,
        unit: data.unidad || 'PEN/kg',
        date: data.fecha || new Date().toISOString(),
        source: 'SIM MINAGRI'
      };

      return {
        product,
        region,
        priceData,
        isMock: false
      };
    } catch (error) {
      console.debug(`SIMIntegration.getFoodPrices error for ${product} in ${region}:`, error?.message || error);

      // Mock food prices based on typical Peruvian market prices
      const mockPrices = {
        'rice': { current: 4.50, min: 4.20, max: 4.80, avg: 4.45 },
        'potatoes': { current: 2.20, min: 1.80, max: 2.60, avg: 2.25 },
        'corn': { current: 3.10, min: 2.80, max: 3.40, avg: 3.15 },
        'beans': { current: 5.80, min: 5.20, max: 6.50, avg: 5.85 }
      };

      const productData = mockPrices[product.toLowerCase()] || { current: 3.00, min: 2.50, max: 3.50, avg: 3.00 };

      return {
        product,
        region,
        priceData: {
          product,
          region: region || 'Lima',
          currentPrice: productData.current,
          minPrice: productData.min,
          maxPrice: productData.max,
          averagePrice: productData.avg,
          unit: 'PEN/kg',
          date: new Date().toISOString(),
          source: 'Mock SIM Data'
        },
        isMock: true
      };
    }
  }

  async getPriceHistory(product, region, days = 30) {
    try {
      // Attempt to fetch real SIM price history
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const url = `${this.baseUrl}/precios/historico?producto=${encodeURIComponent(product)}&region=${encodeURIComponent(region)}&fecha_inicio=${startDate.toISOString().split('T')[0]}&fecha_fin=${endDate.toISOString().split('T')[0]}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`SIM API error: ${response.status}`);
      }

      const data = await response.json();

      // Process historical price data
      const historyData = (data.precios || []).map(item => ({
        date: item.fecha,
        price: item.precio,
        volume: item.volumen || 0
      }));

      return {
        product,
        region,
        historyData,
        isMock: false
      };
    } catch (error) {
      console.debug(`SIMIntegration.getPriceHistory error for ${product} in ${region}:`, error?.message || error);

      // Generate mock historical data
      const historyData = [];
      const basePrice = { rice: 4.50, potatoes: 2.20, corn: 3.10, beans: 5.80 }[product.toLowerCase()] || 3.00;

      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
        const price = Math.max(0.1, basePrice + variation);

        historyData.push({
          date: date.toISOString().split('T')[0],
          price: Math.round(price * 100) / 100,
          volume: Math.floor(Math.random() * 1000) + 100
        });
      }

      return {
        product,
        region,
        historyData,
        isMock: true
      };
    }
  }

  async getVolatilityIndex(product, region) {
    try {
      // Attempt to fetch real SIM volatility data
      const url = `${this.baseUrl}/volatilidad?producto=${encodeURIComponent(product)}&region=${encodeURIComponent(region)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`SIM API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        product,
        region,
        volatilityIndex: data.indice_volatilidad || 0,
        riskLevel: data.nivel_riesgo || 'medium',
        isMock: false
      };
    } catch (error) {
      console.debug(`SIMIntegration.getVolatilityIndex error for ${product} in ${region}:`, error?.message || error);

      // Mock volatility based on product type
      const volatilities = {
        'rice': 0.12,
        'potatoes': 0.18,
        'corn': 0.15,
        'beans': 0.09
      };

      const volatility = volatilities[product.toLowerCase()] || 0.15;
      const riskLevel = volatility > 0.15 ? 'high' : volatility > 0.10 ? 'medium' : 'low';

      return {
        product,
        region,
        volatilityIndex: volatility,
        riskLevel,
        isMock: true
      };
    }
  }
}

export default SIMIntegration;
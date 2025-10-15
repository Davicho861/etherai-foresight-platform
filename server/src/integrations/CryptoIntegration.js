import safeFetch from '../lib/safeFetch.js';

class CryptoIntegration {
  constructor() {
    this.baseUrl = 'https://api.coingecko.com/api/v3';
  }

  async getCryptoData(cryptoIds = ['bitcoin', 'ethereum'], vsCurrency = 'usd') {
    try {
      const ids = cryptoIds.join(',');
      const url = `${this.baseUrl}/coins/markets?ids=${ids}&vs_currency=${vsCurrency}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d%2C30d`;
      const data = await safeFetch(url, {}, { timeout: 10000, retries: 2 });
      return data;
    } catch (error) {
      const { forceMocksEnabled } = await import('../lib/force-mocks.js');
      if (forceMocksEnabled()) {
        console.error('CryptoIntegration: returning FORCE_MOCKS mock for crypto data due to error:', error);
        return { error: null, cryptoIds, vsCurrency, isMock: true, source: 'FORCE_MOCKS:Crypto' };
      }
      console.error('Error fetching crypto data:', error);
      throw new Error(`CryptoIntegration failed: ${error && error.message ? error.message : String(error)}`);
    }
  }

  async getHistoricalData(cryptoId, days = 30, vsCurrency = 'usd') {
    try {
      const url = `${this.baseUrl}/coins/${cryptoId}/market_chart?vs_currency=${vsCurrency}&days=${days}&interval=daily`;
      const data = await safeFetch(url, {}, { timeout: 10000, retries: 2 });
      return data;
    } catch (error) {
      const { forceMocksEnabled: forceMocksEnabled2 } = await import('../lib/force-mocks.js');
      if (forceMocksEnabled2()) {
        console.error('CryptoIntegration: returning FORCE_MOCKS mock for historical data due to error:', error);
        return { error: null, cryptoId, days, vsCurrency, isMock: true, source: 'FORCE_MOCKS:Crypto' };
      }
      console.error('Error fetching historical crypto data:', error);
      throw new Error(`CryptoIntegration historical failed: ${error && error.message ? error.message : String(error)}`);
    }
  }

}

export default CryptoIntegration;
class CryptoIntegration {
  constructor() {
    this.baseUrl = 'https://api.coingecko.com/api/v3';
  }

  async getCryptoData(cryptoIds = ['bitcoin', 'ethereum'], vsCurrency = 'usd') {
    try {
      const ids = cryptoIds.join(',');
      const url = `${this.baseUrl}/coins/markets?ids=${ids}&vs_currency=${vsCurrency}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d%2C30d`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      // No fallback to mock data - return error indication
      return { error: error.message, cryptoIds, vsCurrency };
    }
  }

  async getHistoricalData(cryptoId, days = 30, vsCurrency = 'usd') {
    try {
      const url = `${this.baseUrl}/coins/${cryptoId}/market_chart?vs_currency=${vsCurrency}&days=${days}&interval=daily`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching historical crypto data:', error);
      // No fallback to mock data - return error indication
      return { error: error.message, cryptoId, days, vsCurrency };
    }
  }

}

export default CryptoIntegration;
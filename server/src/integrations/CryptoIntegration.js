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
      // Fallback to mock data
      return this.getMockCryptoData(cryptoIds, vsCurrency);
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
      // Fallback to mock data
      return this.getMockHistoricalData(cryptoId, days, vsCurrency);
    }
  }

  getMockCryptoData(cryptoIds, vsCurrency) {
    return cryptoIds.map(id => ({
      id,
      symbol: id.substring(0, 3).toUpperCase(),
      name: id.charAt(0).toUpperCase() + id.slice(1),
      image: `https://assets.coingecko.com/coins/images/1/large/${id}.png`,
      current_price: Math.random() * 50000 + 1000,
      market_cap: Math.random() * 1000000000000,
      market_cap_rank: Math.floor(Math.random() * 100) + 1,
      fully_diluted_valuation: Math.random() * 1000000000000,
      total_volume: Math.random() * 10000000000,
      high_24h: Math.random() * 55000 + 1000,
      low_24h: Math.random() * 45000 + 1000,
      price_change_24h: (Math.random() - 0.5) * 2000,
      price_change_percentage_24h: (Math.random() - 0.5) * 10,
      market_cap_change_24h: (Math.random() - 0.5) * 10000000000,
      market_cap_change_percentage_24h: (Math.random() - 0.5) * 5,
      circulating_supply: Math.random() * 21000000,
      total_supply: 21000000,
      max_supply: 21000000,
      ath: Math.random() * 70000 + 10000,
      ath_change_percentage: (Math.random() - 0.5) * 50,
      ath_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      atl: Math.random() * 100,
      atl_change_percentage: Math.random() * 1000,
      atl_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      roi: null,
      last_updated: new Date().toISOString(),
      sparkline_in_7d: {
        price: Array.from({ length: 168 }, () => Math.random() * 50000 + 1000)
      },
      price_change_percentage_1h_in_currency: (Math.random() - 0.5) * 5,
      price_change_percentage_24h_in_currency: (Math.random() - 0.5) * 10,
      price_change_percentage_7d_in_currency: (Math.random() - 0.5) * 20,
      price_change_percentage_30d_in_currency: (Math.random() - 0.5) * 50
    }));
  }

  getMockHistoricalData(cryptoId, days, vsCurrency) {
    const prices = [];
    const marketCaps = [];
    const totalVolumes = [];

    for (let i = days; i >= 0; i--) {
      const timestamp = Date.now() - i * 24 * 60 * 60 * 1000;
      const price = Math.random() * 50000 + 1000 + Math.sin(i / 10) * 5000; // Add some trend
      prices.push([timestamp, price]);
      marketCaps.push([timestamp, price * Math.random() * 20000000]);
      totalVolumes.push([timestamp, Math.random() * 1000000000]);
    }

    return {
      prices,
      market_caps: marketCaps,
      total_volumes: totalVolumes
    };
  }
}

export default CryptoIntegration;
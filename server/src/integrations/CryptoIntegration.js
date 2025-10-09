class CryptoIntegration {
  constructor() {
    this.baseUrl = 'https://api.coingecko.com/api/v3';
  }

  async getCryptoData(cryptoIds = ['bitcoin', 'ethereum'], _vsCurrency = 'usd') {
    void _vsCurrency;
    try {
      const ids = cryptoIds.join(',');
      const url = `${this.baseUrl}/coins/markets?ids=${ids}&vs_currency=${_vsCurrency}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d%2C30d`;
      const safeFetch = (await import('../lib/safeFetch.js')).default;
      const data = await safeFetch(url, { method: 'GET' }, { timeout: 7000, retries: 2 });
      return data;
    } catch (error) {
      console.debug('CryptoIntegration getCryptoData error:', error?.message || error, 'vsCurrency:', _vsCurrency);
      // Fallback to mock data
      return this.getMockCryptoData(cryptoIds, _vsCurrency);
    }
  }

  async getHistoricalData(cryptoId, days = 30, _vsCurrency = 'usd') {
    void _vsCurrency;
    try {
      const url = `${this.baseUrl}/coins/${cryptoId}/market_chart?vs_currency=${_vsCurrency}&days=${days}&interval=daily`;
      const safeFetch = (await import('../lib/safeFetch.js')).default;
      const data = await safeFetch(url, { method: 'GET' }, { timeout: 7000, retries: 2 });
      return data;
    } catch (error) {
      console.debug('CryptoIntegration getHistoricalData error:', error?.message || error, 'vsCurrency:', _vsCurrency);
      // Fallback to mock data
      return this.getMockHistoricalData(cryptoId, days, _vsCurrency);
    }
  }

  getMockCryptoData(cryptoIds, _vsCurrency) {
    void _vsCurrency;
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

  getMockHistoricalData(cryptoId, days, _vsCurrency) {
    void _vsCurrency;
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
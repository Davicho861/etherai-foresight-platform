// Minimal mock factory that supports mockImplementation like jest.fn().mockImplementation
let _impl = () => ({
  getCryptoData: jest.fn().mockResolvedValue([
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      current_price: 50000,
      market_cap: 1000000000000,
      price_change_percentage_24h: 2.5
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      current_price: 3000,
      market_cap: 350000000000,
      price_change_percentage_24h: 1.8
    }
  ]),
  getHistoricalData: jest.fn().mockResolvedValue({
    prices: [[Date.now(), 50000]],
    market_caps: [[Date.now(), 1000000000000]],
    total_volumes: [[Date.now(), 20000000000]]
  })
});

function MockCryptoIntegration() {
  return _impl();
}

MockCryptoIntegration.mockImplementation = (fn) => {
  _impl = fn;
  return MockCryptoIntegration;
};

module.exports = MockCryptoIntegration;
module.exports.default = MockCryptoIntegration;
// Minimal mock factory that supports mockImplementation like jest.fn().mockImplementation
let _impl = () => ({
  getFoodPrices: async (product, region) => ({
    product,
    region,
    priceData: {
      product,
      region: region || 'Lima',
      currentPrice: 4.50,
      minPrice: 4.20,
      maxPrice: 4.80,
      averagePrice: 4.45,
      unit: 'PEN/kg',
      date: new Date().toISOString(),
      source: 'Mock SIM Data'
    },
    isMock: true
  }),
  getPriceHistory: async (product, region, days) => {
    const historyData = [];
    for (let i = days || 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      historyData.push({
        date: date.toISOString().split('T')[0],
        price: 4.50,
        volume: 500
      });
    }
    return {
      product,
      region,
      historyData,
      isMock: true
    };
  },
  getVolatilityIndex: async (product, region) => ({
    product,
    region,
    volatilityIndex: 0.12,
    riskLevel: 'medium',
    isMock: true
  })
});

function MockSIMIntegration() {
  return _impl();
}

MockSIMIntegration.mockImplementation = (fn) => {
  _impl = fn;
  return MockSIMIntegration;
};

module.exports = MockSIMIntegration;
module.exports.default = MockSIMIntegration;
// Minimal mock factory that supports mockImplementation like jest.fn().mockImplementation
let _impl = () => ({
  getAgriculturalProduction: async (product, year) => ({
    product,
    year,
    productionData: [{
      product,
      year,
      production: 2200000,
      unit: 'tonnes'
    }],
    isMock: true
  }),
  getSupplyChainCapacity: async (region) => ({
    region,
    capacityData: [{
      region,
      capacity: 85,
      distance: 0,
      cost: 1.2
    }],
    isMock: true
  })
});

function MockMINAGRIIntegration() {
  return _impl();
}

MockMINAGRIIntegration.mockImplementation = (fn) => {
  _impl = fn;
  return MockMINAGRIIntegration;
};

module.exports = MockMINAGRIIntegration;
module.exports.default = MockMINAGRIIntegration;
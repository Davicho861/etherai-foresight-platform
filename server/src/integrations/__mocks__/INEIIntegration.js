// Minimal mock factory that supports mockImplementation like jest.fn().mockImplementation
let _impl = () => ({
  getDemographicData: async (department, year) => ({
    department,
    year,
    demographicData: {
      department,
      year,
      population: 10750000,
      growthRate: 1.2,
      urbanPopulation: 9500000,
      ruralPopulation: 1250000
    },
    isMock: true
  }),
  getEconomicIndicators: async (department, year) => ({
    department,
    year,
    economicData: {
      department,
      year,
      gdp: 45000000,
      unemploymentRate: 6.5,
      povertyRate: 15.2,
      incomePerCapita: 18000
    },
    isMock: true
  })
});

function MockINEIIntegration() {
  return _impl();
}

MockINEIIntegration.mockImplementation = (fn) => {
  _impl = fn;
  return MockINEIIntegration;
};

module.exports = MockINEIIntegration;
module.exports.default = MockINEIIntegration;
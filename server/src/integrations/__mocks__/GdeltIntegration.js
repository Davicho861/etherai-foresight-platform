// Minimal mock factory that supports mockImplementation like jest.fn().mockImplementation
let _impl = () => ({
  getSocialEvents: async (country, startDate, endDate) => ({
    country,
    period: { start: startDate, end: endDate },
    eventCount: 0,
    socialIntensity: 0,
    articles: [],
    isMock: true
  })
});

function MockGdeltIntegration() {
  return _impl();
}

MockGdeltIntegration.mockImplementation = (fn) => {
  _impl = fn;
  return MockGdeltIntegration;
};

module.exports = MockGdeltIntegration;
module.exports.default = MockGdeltIntegration;

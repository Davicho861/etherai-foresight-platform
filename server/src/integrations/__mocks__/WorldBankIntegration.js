// Minimal mock factory that supports mockImplementation like jest.fn().mockImplementation
let _impl = () => ({
  getEconomicIndicators: jest.fn().mockResolvedValue({
    country: 'TEST',
    period: { startYear: '2020', endYear: '2024' },
    indicators: { test: { value: 100, year: '2024', country: 'TEST' } },
    isMock: true
  }),
  getKeyEconomicData: jest.fn().mockResolvedValue({
    country: 'TEST',
    period: { startYear: '2020', endYear: '2024' },
    indicators: {
      'NY.GDP.PCAP.CD': { value: 6500.23, year: '2023', country: 'TEST' },
      'FP.CPI.TOTL.ZG': { value: 6.4, year: '2024', country: 'TEST' },
      'SL.UEM.TOTL.ZS': { value: 11.2, year: '2023', country: 'TEST' },
      'PA.NUS.FCRF': { value: 3800.5, year: '2023', country: 'TEST' },
      'DT.DOD.DECT.CD': { value: 123456789.0, year: '2022', country: 'TEST' },
      'FI.RES.TOTL.CD': { value: 98765432.1, year: '2023', country: 'TEST' }
    },
    isMock: true,
    source: 'World Bank Mock'
  }),
  getFoodSecurityData: jest.fn().mockResolvedValue({
    countries: ['COL', 'PER', 'ARG'],
    period: { startYear: '2020', endYear: '2024' },
    indicator: 'SN.ITK.DEFC.ZS',
    data: {
      COL: { value: 5.2, year: '2024', country: 'Colombia', indicator: 'Prevalence of undernourishment (% of population)' },
      PER: { value: 7.1, year: '2024', country: 'Peru', indicator: 'Prevalence of undernourishment (% of population)' },
      ARG: { value: 4.8, year: '2024', country: 'Argentina', indicator: 'Prevalence of undernourishment (% of population)' }
    },
    isMock: false,
    source: 'World Bank API'
  })
});

function MockWorldBankIntegration() {
  return _impl();
}

MockWorldBankIntegration.mockImplementation = (fn) => {
  _impl = fn;
  return MockWorldBankIntegration;
};

module.exports = MockWorldBankIntegration;
module.exports.default = MockWorldBankIntegration;
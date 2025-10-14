export function forceMocksEnabled() {
  return process.env.FORCE_MOCKS === 'true' || process.env.FORCE_MOCKS === '1' || process.env.NODE_ENV === 'test';
}

export default forceMocksEnabled;

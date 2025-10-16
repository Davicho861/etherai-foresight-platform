export function forceMocksEnabled() {
  // Return true only when FORCE_MOCKS env var is explicitly enabled.
  // Accept both 'true' and '1' for flexibility.
  // Removed NODE_ENV === 'test' to allow tests to control mocking behavior explicitly.
  try {
    return (
      process.env.FORCE_MOCKS === 'true' ||
      process.env.FORCE_MOCKS === '1'
    );
  } catch (e) {
    return false;
  }
}

export default forceMocksEnabled;

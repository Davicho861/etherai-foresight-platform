const { callWithFallback } = require('../src/utils/externalWithFallback');

describe('callWithFallback', () => {
  test('returns value when externalCall succeeds', async () => {
    const external = async () => 'hello';
    const res = await callWithFallback(external, 'fallback');
    expect(res.ok).toBe(true);
    expect(res.value).toBe('hello');
  });

  test('returns fallback when externalCall throws', async () => {
    const external = async () => { throw new Error('external failure'); };
    const res = await callWithFallback(external, () => 'fallback-value');
    expect(res.ok).toBe(false);
    expect(res.value).toBe('fallback-value');
    expect(res.error).toMatch(/external failure/);
  });
});

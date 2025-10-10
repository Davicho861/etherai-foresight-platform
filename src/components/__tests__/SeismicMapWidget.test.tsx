import { normalizeSeismicRaw } from '../SeismicMapWidget';

describe('normalizeSeismicRaw', () => {
  test('returns empty array for null/undefined', () => {
    expect(normalizeSeismicRaw(null)).toEqual([]);
    expect(normalizeSeismicRaw(undefined)).toEqual([]);
  });

  test('returns same array if array provided', () => {
    const arr = [{ id: 1 }];
    expect(normalizeSeismicRaw(arr)).toBe(arr);
  });

  test('extracts events array', () => {
    const raw = { events: [{ id: 'e1' }, { id: 'e2' }] };
    expect(normalizeSeismicRaw(raw)).toEqual(raw.events);
  });

  test('extracts features array', () => {
    const raw = { features: [{ id: 'f1' }] };
    expect(normalizeSeismicRaw(raw)).toEqual(raw.features);
  });

  test('unknown shapes -> empty array', () => {
    expect(normalizeSeismicRaw({ foo: 'bar' })).toEqual([]);
  });
});

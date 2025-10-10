import React from 'react';
import { render, screen } from '@testing-library/react';
import SeismicMapWidget, { normalizeSeismicRaw } from '../SeismicMapWidget';

// Prevent react-simple-maps from performing external fetches during tests
jest.mock('react-simple-maps', () => {
  const React = require('react');
  // Render minimal SVG structure so JSDOM recognizes <circle> and other SVG nodes
  return {
    ComposableMap: ({ children }: any) => React.createElement('svg', { viewBox: '0 0 800 600' }, children),
    Geographies: ({ children }: any) => React.createElement('g', {}, children({ geographies: [] })),
    Geography: () => React.createElement('path', { d: '' }),
    Marker: ({ children, coordinates }: any) => React.createElement('g', { 'data-coords': coordinates }, children),
  };
});

describe('SeismicMapWidget (DOM)', () => {
  test('normalizeSeismicRaw handles arrays, events, features and unknown', () => {
    expect(normalizeSeismicRaw(null)).toEqual([]);
    expect(normalizeSeismicRaw([])).toEqual([]);

    const arr = [{ id: 'a' }];
    expect(normalizeSeismicRaw(arr)).toBe(arr);

    const ev = { events: [{ id: 'e1' }] };
    expect(normalizeSeismicRaw(ev)).toEqual(ev.events);

    const feat = { features: [{ id: 'f1' }] };
    expect(normalizeSeismicRaw(feat)).toEqual(feat.features);

    expect(normalizeSeismicRaw({})).toEqual([]);
  });

  test('renders and shows SIMULADO when isMock true', () => {
    const mockData = {
      events: [
        {
          id: 'evt1',
          properties: { mag: 5, place: 'Place, Country', time: Date.now() },
          geometry: { coordinates: [-60, -15, 10] }
        }
      ],
      isMock: true
    };

    render(<SeismicMapWidget seismicData={mockData} />);

    // Basic expectations: title and the SIMULADO badge
    expect(screen.getByText(/Monitoreo Sísmico LATAM/i)).toBeInTheDocument();
    expect(screen.getByText(/SIMULADO/i)).toBeInTheDocument();
  });
});

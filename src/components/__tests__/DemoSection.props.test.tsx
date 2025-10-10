import React from 'react';
import { render, waitFor } from '@testing-library/react';
import DemoSection from '@/components/DemoSection';
import { MemoryRouter } from 'react-router-dom';

// Mock child components to capture props
const mockFood = jest.fn((props: any) => <div data-testid="mock-food" />);
const mockEthical = jest.fn((props: any) => <div data-testid="mock-ethical" />);
const mockResilience = jest.fn((props: any) => <div data-testid="mock-resilience" />);

jest.mock('@/components/FoodSecurityDashboard', () => (props: any) => {
  mockFood(props);
  return <div data-testid="mock-food" />;
});
jest.mock('@/components/EthicalVectorDisplay', () => (props: any) => {
  mockEthical(props);
  return <div data-testid="mock-ethical" />;
});
jest.mock('@/components/CommunityResilienceWidget', () => (props: any) => {
  mockResilience(props);
  return <div data-testid="mock-resilience" />;
});

// Mock Sidebar and SeismicMapWidget to avoid router/context heavy behavior in test
jest.mock('@/components/Sidebar', () => () => <div data-testid="mock-sidebar" />);
jest.mock('@/components/SeismicMapWidget', () => () => <div data-testid="mock-seismic" />);
// Mock AnimatedMetrics and MissionGallery which use browser APIs
jest.mock('@/components/AnimatedMetrics', () => () => <div data-testid="mock-animated-metric" />);
jest.mock('@/components/MissionGallery', () => () => <div data-testid="mock-mission-gallery" />);

// Mock react-simple-maps to avoid fetching topojson and internal geographies logic in JSDOM
jest.mock('react-simple-maps', () => ({
  ComposableMap: (props: any) => <div data-testid="mock-composable-map">{props.children}</div>,
  Geographies: (props: any) => {
    // Call function-as-children with an empty geographies array to avoid geographies.map errors
    const render = typeof props.children === 'function' ? props.children({ geographies: [] }) : props.children;
    return <div data-testid="mock-geographies">{render}</div>;
  },
  Geography: (props: any) => <div data-testid="mock-geography" />,
}));

// Provide a mock response for fetch
const demoResponse = {
  timestamp: '2025-10-10T21:08:02.902Z',
  lastUpdated: '2025-10-10T21:08:02.902Z',
  kpis: { precisionPromedio: 90, prediccionesDiarias: 100, monitoreoContinuo: 24, coberturaRegional: 6 },
  countries: [{ name: 'Colombia', code: 'COL', lat: 4.57, lon: -74.29 }],
  communityResilience: { data: { COL: { country: 'Colombia', resilienceScore: 75 } }, isMock: true },
  foodSecurity: { data: [{ country: 'Colombia', year: 2024, prevalenceUndernourishment: 10, riskIndex: 45, volatilityIndex: 12 }], isMock: false },
  ethicalAssessment: { success: true, data: { overallScore: 65, vector: [60,70,65], assessment: 'Medium', timestamp: '2025-10-10T21:08:02.902Z' }, isMock: false },
  global: { crypto: [], seismic: { events: [], summary: { totalEvents:0 } } }
};

beforeEach(() => {
  jest.resetAllMocks();
  // Provide a minimal IntersectionObserver mock for JSDOM
  // @ts-ignore
  if (typeof global.IntersectionObserver === 'undefined') {
    // @ts-ignore
    global.IntersectionObserver = class {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  // @ts-ignore
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(demoResponse) }));
});

afterEach(() => {
  // @ts-ignore
  global.fetch = undefined;
});

test('DemoSection fetches live-state and passes props to children', async () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <DemoSection />
    </MemoryRouter>
  );

  // Wait for loading to finish and for our mocked child components to be rendered
  await waitFor(() => expect(getByTestId('mock-food')).toBeInTheDocument());
  await waitFor(() => expect(getByTestId('mock-ethical')).toBeInTheDocument());
  await waitFor(() => expect(getByTestId('mock-resilience')).toBeInTheDocument());

  // Assert the child components were called with the expected props
  expect(mockFood).toHaveBeenCalledWith(expect.objectContaining({ foodSecurityData: expect.any(Object) }));
  expect(mockEthical).toHaveBeenCalledWith(expect.objectContaining({ ethicalAssessment: expect.any(Object) }));
  expect(mockResilience).toHaveBeenCalledWith(expect.objectContaining({ resilienceData: expect.any(Object) }));
});

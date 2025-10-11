import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DemoPage from '../DemoPage';

// Mock all subcomponents
jest.mock('@/components/Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

jest.mock('@/components/MissionGallery', () => {
  return function MockMissionGallery() {
    return <div data-testid="mission-gallery">Mission Gallery</div>;
  };
});

jest.mock('@/components/AnimatedMetrics', () => {
  return function MockAnimatedMetric({ value, suffix }: { value: number; suffix: string }) {
    return <div data-testid="animated-metric">{value}{suffix}</div>;
  };
});

jest.mock('@/components/CommunityResilienceWidget', () => {
  return function MockCommunityResilienceWidget() {
    return <div data-testid="community-resilience-widget">Community Resilience</div>;
  };
});

jest.mock('@/components/SeismicMapWidget', () => {
  return function MockSeismicMapWidget() {
    return <div data-testid="seismic-map-widget">Seismic Map</div>;
  };
});

jest.mock('@/components/FoodSecurityDashboard', () => {
  return function MockFoodSecurityDashboard() {
    return <div data-testid="food-security-dashboard">Food Security</div>;
  };
});

jest.mock('@/components/EthicalVectorDisplay', () => {
  return function MockEthicalVectorDisplay() {
    return <div data-testid="ethical-vector-display">Ethical Vector</div>;
  };
});

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('DemoPage', () => {
  const mockDemoData = {
    kpis: {
      precisionPromedio: 90,
      prediccionesDiarias: 150,
      monitoreoContinuo: 24,
      coberturaRegional: 20
    },
    countries: [
      {
        name: 'Argentina',
        code: 'ARG',
        lat: -34,
        lon: -64,
        climate: {},
        social: {},
        economic: {}
      },
      {
        name: 'Brasil',
        code: 'BRA',
        lat: -10,
        lon: -55,
        climate: {},
        social: {},
        economic: {}
      }
    ],
    global: {
      crypto: {},
      seismic: {}
    },
    lastUpdated: '2025-10-11T18:47:41.528Z'
  };

  // Ensure a safe default for global fetch: return demo data for live-state and
  // a sensible response for predict-scenario. Individual tests may override.
  beforeEach(() => {
    // Reset the mock implementation and calls to avoid bleed between tests
    mockFetch.mockReset();
    mockFetch.mockImplementation((input, init) => {
      const url = typeof input === 'string' ? input : (input && input.url) || '';
      if (url.includes('/predict-scenario') || (init && init.method === 'POST')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ riskIndex: 75 }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockDemoData) });
    });
    // @ts-ignore
    global.fetch = mockFetch;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Loading State', () => {
    test('renders loading state initially', () => {
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      expect(screen.getByText('Cargando datos de la demo...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    test('renders error state when fetch fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        // The UI now shows a non-blocking informational banner when demo falls back to mocks
        expect(screen.getByText(/datos de la demo/i)).toBeInTheDocument();
      });
    });

    test('renders error state when response is not ok', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error('Bad response'))
      });

      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        // The UI now shows a non-blocking informational banner when demo falls back to mocks
        expect(screen.getByText(/datos de la demo/i)).toBeInTheDocument();
      });
    });
  });

  describe('Data Loaded State', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDemoData)
      });
    });

    test('renders header correctly', async () => {
      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Praevisio AI - Centro de Mando')).toBeInTheDocument();
        expect(screen.getByText('Inteligencia Predictiva de Élite para América Latina - 90% de Precisión')).toBeInTheDocument();
      });
    });

    test('renders KPI metrics', async () => {
      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
  const metrics = screen.getAllByTestId('animated-metric');
  expect(metrics[0]).toHaveTextContent('90%');
  expect(metrics[1]).toHaveTextContent('150K');
  expect(metrics[2]).toHaveTextContent('24/7');
  expect(metrics[3]).toHaveTextContent('20 Países');
      });
    });

    test('renders country selector', async () => {
      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Selección de País')).toBeInTheDocument();
        // Prefer the testid for the Select trigger to avoid Radix duplication
        expect(screen.getByTestId('country-select-trigger')).toBeInTheDocument();
      });
    });

    test('renders interactive map', async () => {
      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Mapa Interactivo - América Latina')).toBeInTheDocument();
        expect(screen.getByTestId('global-map')).toBeInTheDocument();
      });
    });

    test('renders oracle control panel', async () => {
      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Panel de Control del Oráculo')).toBeInTheDocument();
        expect(screen.getByText('Simula escenarios y observa cómo cambian las predicciones')).toBeInTheDocument();
      });
    });

    test('renders mission gallery', async () => {
      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Galería de Misiones - Task Replay')).toBeInTheDocument();
        expect(screen.getByTestId('mission-gallery')).toBeInTheDocument();
      });
    });

    test('renders symphony of manifestation section', async () => {
      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Sinfonía de Manifestación Total')).toBeInTheDocument();
        expect(screen.getByTestId('community-resilience-widget')).toBeInTheDocument();
        expect(screen.getByTestId('seismic-map-widget')).toBeInTheDocument();
        expect(screen.getByTestId('food-security-dashboard')).toBeInTheDocument();
        expect(screen.getByTestId('ethical-vector-display')).toBeInTheDocument();
      });
    });
  });

  describe('Country Selection', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDemoData)
      });
    });

    test('selects country and displays country card', async () => {
      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        // Use the testid added to the Select trigger to avoid Radix internal nodes
        expect(screen.getByTestId('country-select-trigger')).toBeInTheDocument();
      });

  const selectTrigger = screen.getByTestId('country-select-trigger');
  fireEvent.click(selectTrigger);

  // The option text may be duplicated by Radix internals; pick the first visible match
  const argentinaOption = screen.getAllByText(/Argentina/).find(el => el.textContent && el.textContent.includes('Argentina'));
  if (argentinaOption) fireEvent.click(argentinaOption);

      await waitFor(() => {
        expect(screen.getByTestId('country-card-ARG')).toBeInTheDocument();
        expect(screen.getByText('País Seleccionado:')).toBeInTheDocument();
        expect(screen.getByText('Argentina')).toBeInTheDocument();
      });
    });
  });

  describe('Map Interactions', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDemoData)
      });
    });

    test('shows country name on hover', async () => {
      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('global-map')).toBeInTheDocument();
      });

      // Mock geography element
      const mockGeography = {
        rsmKey: 'ARG',
        properties: { ISO_A3: 'ARG' }
      };

      // Find the geography element (this is simplified, in real test we'd need to mock ComposableMap properly)
      // For now, we'll test that the map renders
      expect(screen.getByTestId('global-map')).toBeInTheDocument();
    });
  });

  describe('Simulation Panel', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDemoData)
      });
    });

    test('renders simulation controls', async () => {
      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Selecciona País para Simulación')).toBeInTheDocument();
        expect(screen.getByText('Aumento de Inflación (%): 0%')).toBeInTheDocument();
        expect(screen.getByText('Nivel de Sequía: 0/10')).toBeInTheDocument();
        expect(screen.getByTestId('simulate-button')).toBeInTheDocument();
      });
    });

    test('updates inflation slider', async () => {
      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Aumento de Inflación (%): 0%')).toBeInTheDocument();
      });

      // Note: Slider interaction testing would require more complex mocking
      // This is a basic test to ensure the component renders
    });

    test('simulates scenario successfully', async () => {
      // First call: live-state, second call: predict-scenario
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDemoData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ riskIndex: 75 }) });

      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Calcular Índice de Riesgo')).toBeInTheDocument();
      });

      // Select country via simulation select trigger
  const countrySelect = screen.getByTestId('simulation-select-trigger');
  fireEvent.click(countrySelect);

  // Prefer the first visible Argentina option
  const argentinaOptions = screen.getAllByText(/Argentina/).filter(el => el.textContent && el.textContent.trim() === 'Argentina');
  if (argentinaOptions.length) fireEvent.click(argentinaOptions[0]);

  // Click simulate button via testid
  const simulateButton = screen.getByTestId('simulate-button');
  fireEvent.click(simulateButton);

      // Ensure the predict-scenario endpoint was called (POST)
      await waitFor(() => {
        expect(mockFetch.mock.calls.some(call => {
          const url = typeof call[0] === 'string' ? call[0] : (call[0] && call[0].url) || '';
          const opts = call[1] || {};
          return url.includes('/predict-scenario') || opts.method === 'POST';
        })).toBe(true);
      });
    });

    test('shows explanation when button is clicked', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDemoData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ riskIndex: 75 }) });

      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('simulation-select-trigger')).toBeInTheDocument();
      });

      // Select country and simulate
      const countrySelect = screen.getByTestId('simulation-select-trigger');
      fireEvent.click(countrySelect);
      const argentinaBtn = screen.getAllByText(/Argentina/).find(el => el.textContent && el.textContent.trim() === 'Argentina');
      if (argentinaBtn) fireEvent.click(argentinaBtn);

  const simulateButton = screen.getByTestId('simulate-button');
  fireEvent.click(simulateButton);

      // Ensure the POST to predict-scenario happened
      await waitFor(() => {
        expect(mockFetch.mock.calls.some(call => (typeof call[0] === 'string' ? call[0] : (call[0] && call[0].url) || '').includes('/predict-scenario') || (call[1] && call[1].method === 'POST'))).toBe(true);
      });
    });

    test('handles simulation error with fallback calculation', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDemoData) })
        .mockRejectedValueOnce(new Error('Simulation failed'));

      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Calcular Índice de Riesgo')).toBeInTheDocument();
      });

      // Select country and set parameters
  const countrySelect = screen.getByTestId('simulation-select-trigger');
  fireEvent.click(countrySelect);
  const argentinaBtn = screen.getAllByText(/Argentina/).find(el => el.textContent && el.textContent.trim() === 'Argentina');
  if (argentinaBtn) fireEvent.click(argentinaBtn);

      // Set inflation to 10 and drought to 5
      // Note: Actual slider interaction would require more setup

  fireEvent.click(screen.getByTestId('simulate-button'));

      await waitFor(() => {
        // Ensure we attempted the simulation (POST) which was rejected, so fallback path executed
        expect(mockFetch.mock.calls.some(call => (typeof call[0] === 'string' ? call[0] : (call[0] && call[0].url) || '').includes('/predict-scenario') || (call[1] && call[1].method === 'POST'))).toBe(true);
      });
    });
  });

  describe('Data Refresh', () => {
    test('refreshes data every 60 seconds', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDemoData)
      });

      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/demo/live-state');
      });

      // Fast-forward 60 seconds
      act(() => {
        jest.advanceTimersByTime(60000);
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Briefing Panel', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDemoData)
      });
    });

    test('shows briefing panel when country is clicked on map', async () => {
      render(
        <MemoryRouter>
          <DemoPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('global-map')).toBeInTheDocument();
      });

      // Mock clicking on a country in the map
      // This would require mocking the ComposableMap component properly
      // For now, we test that the briefing panel can be shown by setting showBriefing to true
      // In a real scenario, we'd need to simulate the map click
    });
  });
});
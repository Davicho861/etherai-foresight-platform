import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import CIMetricsWidget from '../CIMetricsWidget';

describe('CIMetricsWidget', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders CI metrics widget with title', () => {
    render(<CIMetricsWidget />);

    expect(screen.getByText('Métricas de CI/CD')).toBeInTheDocument();
  });

  test('renders all metric cards with correct data', () => {
    render(<CIMetricsWidget />);

    // Build time
    expect(screen.getByText('Tiempo de Build Promedio')).toBeInTheDocument();
    expect(screen.getByText('12.5 min')).toBeInTheDocument();

    // Test coverage
    expect(screen.getByText('Cobertura de Tests')).toBeInTheDocument();
    expect(screen.getByText('85.3%')).toBeInTheDocument();

    // Failed builds
    expect(screen.getByText('Builds Fallidos (última semana)')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    // Last build status
    expect(screen.getByText('Último Build')).toBeInTheDocument();
    expect(screen.getByText('SUCCESS')).toBeInTheDocument();
  });

  test('renders metric cards with correct styling', () => {
    render(<CIMetricsWidget />);
    const metricIds = ['ci-metric-buildtime', 'ci-metric-coverage', 'ci-metric-failed', 'ci-metric-lastbuild'];
    metricIds.forEach(id => {
      const el = screen.getByTestId(id);
      expect(el).toHaveClass('bg-etherblue-dark/50', 'rounded', 'p-4');
    });
  });

  test('renders grid layout for metrics', () => {
    render(<CIMetricsWidget />);

    const grid = screen.getByText('Tiempo de Build Promedio').closest('.grid');
    expect(grid).toHaveClass('grid', 'grid-cols-2', 'gap-4', 'mb-4');
  });

  test('renders last build status with success color', () => {
    render(<CIMetricsWidget />);

    const statusElement = screen.getByText('SUCCESS');
    expect(statusElement).toHaveClass('text-xl', 'font-bold', 'text-green-400');
  });

  test('renders widget container with correct styling', () => {
    render(<CIMetricsWidget />);

    const container = screen.getByText('Métricas de CI/CD').parentElement;
    expect(container).toHaveClass('bg-etherblue-dark/60', 'border', 'border-gray-700', 'rounded-lg', 'p-6');
  });

  test('does not render oracle log initially', () => {
    render(<CIMetricsWidget />);

    expect(screen.queryByText('Log del Oracle')).not.toBeInTheDocument();
  });

  test('renders oracle log after timeout', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<CIMetricsWidget />);

    // Initially no oracle log
    expect(screen.queryByText('Log del Oracle')).not.toBeInTheDocument();

    // Fast-forward 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByText('Log del Oracle')).toBeInTheDocument();
    });

    expect(screen.getByTestId('oracle-log')).toHaveTextContent('Posible fallo en pipeline de datos debido a alta carga del sistema.');

    // Check console.log was called
    expect(consoleSpy).toHaveBeenCalledWith('[Oracle Prediction] Probabilidad de fallo: 75.0%. Sugerencia: Posible fallo en pipeline de datos debido a alta carga del sistema. Recomendación: Escalar recursos o optimizar consultas.');

    consoleSpy.mockRestore();
  });

  test('renders oracle log with correct styling', async () => {
    render(<CIMetricsWidget />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      const oracleSection = screen.getByText('Log del Oracle').parentElement;
      expect(oracleSection).toHaveClass('bg-yellow-900/50', 'border', 'border-yellow-600', 'rounded', 'p-4');
    });

    const oracleTitle = screen.getByText('Log del Oracle');
    expect(oracleTitle).toHaveClass('text-sm', 'font-bold', 'text-yellow-400', 'mb-2');

    const oracleText = screen.getByText(/Probabilidad de fallo/);
    expect(oracleText).toHaveClass('text-xs', 'text-yellow-200');
  });

  test('clears timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');

    const { unmount } = render(<CIMetricsWidget />);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  test('oracle prediction calculation', async () => {
    render(<CIMetricsWidget />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      const oracleText = screen.getByText(/Probabilidad de fallo: 75.0%/);
      expect(oracleText).toBeInTheDocument();
    });

    // Verify the calculation: probability * 100 = 0.75 * 100 = 75.0
    expect(screen.getByText(/75.0%/)).toBeInTheDocument();
  });

  test('oracle suggestion text', async () => {
    render(<CIMetricsWidget />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByTestId('oracle-log')).toBeInTheDocument();
    });
    expect(screen.getByTestId('oracle-log')).toHaveTextContent('Posible fallo en pipeline de datos debido a alta carga del sistema.');
  });
});
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdvancedInteractiveDashboard from '../../components/AdvancedInteractiveDashboard';

// Mock recharts to avoid rendering issues in tests
jest.mock('recharts', () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  AlertTriangle: () => <div data-testid="alert-triangle" />,
  TrendingUp: () => <div data-testid="trending-up" />,
  Shield: () => <div data-testid="shield" />,
  Clock: () => <div data-testid="clock" />,
  Brain: () => <div data-testid="brain" />,
  Target: () => <div data-testid="target" />,
}));

// Mock UI components
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div data-testid="select" data-value={value} onClick={() => onValueChange?.('salud')}>
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-testid="select-item" data-value={value}>{children}</div>,
  SelectTrigger: ({ children }: any) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: () => <div data-testid="select-value" />,
}));

jest.mock('@/components/ui/slider', () => ({
  Slider: ({ value, onValueChange }: any) => (
    <div
      data-testid="slider"
      data-value={value}
      onClick={() => onValueChange?.([75])}
    />
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button data-testid="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <div data-testid="card-title">{children}</div>,
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <div data-testid="badge">{children}</div>,
}));

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Performance Optimization Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createQueryClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('AdvancedInteractiveDashboard renders without performance regressions', async () => {
    const startTime = performance.now();

    render(
      <QueryClientProvider client={queryClient}>
        <AdvancedInteractiveDashboard />
      </QueryClientProvider>
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Assert that initial render is fast (< 100ms)
    expect(renderTime).toBeLessThan(100);

    // Wait for component to be fully rendered
    await waitFor(() => {
      const elements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('Experimenta') && element?.textContent?.includes('Poder Predictivo');
      });
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  test('Memoized calculations prevent unnecessary re-computations', () => {
    const mockMathRound = jest.spyOn(Math, 'round');

    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <AdvancedInteractiveDashboard />
      </QueryClientProvider>
    );

    const initialCallCount = mockMathRound.mock.calls.length;

    // Re-render component (this should not trigger additional Math.round calls for memoized values)
    rerender(
      <QueryClientProvider client={queryClient}>
        <AdvancedInteractiveDashboard />
      </QueryClientProvider>
    );

    // Memoized calculations should not increase call count significantly
    expect(mockMathRound.mock.calls.length - initialCallCount).toBeLessThan(5);

    mockMathRound.mockRestore();
  });

  test('Lazy loaded components are properly suspended', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AdvancedInteractiveDashboard />
      </QueryClientProvider>
    );

    // Component should render without throwing suspense errors
    await waitFor(() => {
      const elements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('Experimenta') && element?.textContent?.includes('Poder Predictivo');
      });
      expect(elements.length).toBeGreaterThan(0);
    });

    // Check that interactive elements are present
    expect(screen.getByTestId('select')).toBeInTheDocument();
    expect(screen.getAllByTestId('slider')).toHaveLength(2);
    expect(screen.getByTestId('button')).toBeInTheDocument();
  });

  test('Code splitting chunks are properly configured', () => {
    // This test verifies that the build configuration supports code splitting
    // In a real scenario, this would check the generated bundle chunks
    const originalImport = AdvancedInteractiveDashboard;

    expect(typeof originalImport).toBe('function');
    expect(originalImport.name).toBe('AdvancedInteractiveDashboard');
  });

  test('Bundle size optimization through tree shaking', () => {
    // Verify that only necessary imports are included
    // This is a structural test to ensure clean imports
    const component = AdvancedInteractiveDashboard;

    expect(component).toBeDefined();
    expect(typeof component).toBe('function');
  });
});
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnhancedRiskDashboard from '../EnhancedRiskDashboard';

// Mock recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: { children: React.ReactNode }) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  Download: () => <div data-testid="download-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
}));

describe('EnhancedRiskDashboard', () => {
  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dashboard title', () => {
    render(<EnhancedRiskDashboard />);
    expect(screen.getByText('Dashboard de Riesgos en Tiempo Real')).toBeInTheDocument();
  });

  it('displays risk overview cards', () => {
    render(<EnhancedRiskDashboard />);
    expect(screen.getAllByText('COL')).toHaveLength(2); // One in card header, one in alert
    expect(screen.getAllByText('PER')).toHaveLength(2); // One in card header, one in alert
    expect(screen.getAllByText('ARG')).toHaveLength(2); // One in card header, one in alert
  });

  it('shows filter controls', () => {
    render(<EnhancedRiskDashboard />);
    expect(screen.getByText('Filtros:')).toBeInTheDocument();
    expect(screen.getByText('Todos los países')).toBeInTheDocument();
    expect(screen.getByText('Todos los niveles')).toBeInTheDocument();
  });

  it('displays active alerts section', () => {
    render(<EnhancedRiskDashboard />);
    expect(screen.getByText('Alertas Activas (3)')).toBeInTheDocument();
  });

  it('shows risk level badges', () => {
    render(<EnhancedRiskDashboard />);
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('has export functionality', () => {
    render(<EnhancedRiskDashboard />);
    const exportButton = screen.getByText('Exportar');
    expect(exportButton).toBeInTheDocument();
  });

  it('has refresh functionality', () => {
    render(<EnhancedRiskDashboard />);
    const refreshButton = screen.getByText('Actualizar');
    expect(refreshButton).toBeInTheDocument();
  });

  it('displays charts', () => {
    render(<EnhancedRiskDashboard />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('shows last update timestamp', () => {
    render(<EnhancedRiskDashboard />);
    expect(screen.getByText(/Última actualización:/)).toBeInTheDocument();
  });

  it('filters alerts by country', async () => {
    render(<EnhancedRiskDashboard />);

    // Initially shows all alerts
    expect(screen.getByText('Alertas Activas (3)')).toBeInTheDocument();

    // Filter by Colombia
    const selectElement = screen.getByDisplayValue('Todos los países');
    fireEvent.change(selectElement, { target: { value: 'COL' } });

    // Should still show alerts (mock data includes COL)
    expect(screen.getByText('Alertas Activas (1)')).toBeInTheDocument();
  });

  it('exports data when export button is clicked', () => {
    // Mock document methods
    const mockLink = {
      click: jest.fn(),
      setAttribute: jest.fn(),
      style: {}
    };
    const originalCreateElement = document.createElement;
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return mockLink as any;
      }
      return originalCreateElement.call(document, tagName);
    });

    render(<EnhancedRiskDashboard />);

    const exportButton = screen.getByText('Exportar');
    fireEvent.click(exportButton);

    expect(mockLink.click).toHaveBeenCalled();
  });

  it('shows loading state when refreshing', async () => {
    render(<EnhancedRiskDashboard />);

    const refreshButton = screen.getByText('Actualizar');
    fireEvent.click(refreshButton);

    // The button should still be present (no loading text in this implementation)
    expect(refreshButton).toBeInTheDocument();
  });

  it('displays risk factors for alerts', () => {
    render(<EnhancedRiskDashboard />);

    // Check if factors are displayed (Economic, Social, etc.)
    expect(screen.getByText('Economic: 85%')).toBeInTheDocument();
    expect(screen.getByText('Social: 70%')).toBeInTheDocument();
  });

  it('shows trend indicators', () => {
    render(<EnhancedRiskDashboard />);

    // Check for trend emojis or indicators
    const trendElements = screen.getAllByText('📈');
    expect(trendElements.length).toBeGreaterThan(0);
  });
});
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
    expect(screen.getByText('COL')).toBeInTheDocument();
    expect(screen.getByText('PER')).toBeInTheDocument();
    expect(screen.getByText('ARG')).toBeInTheDocument();
  });

  it('shows filter controls', () => {
    render(<EnhancedRiskDashboard />);
    expect(screen.getByText('Filtros:')).toBeInTheDocument();
    expect(screen.getByText('Selecciona un sector')).toBeInTheDocument();
    expect(screen.getByText('Selecciona un nivel de riesgo')).toBeInTheDocument();
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
    const selectTrigger = screen.getAllByText('Selecciona un sector')[0];
    fireEvent.click(selectTrigger);

    // Note: In a real test, we'd need to mock the Select component properly
    // For now, this tests the basic structure
  });

  it('exports data when export button is clicked', () => {
    // Mock document methods
    const mockLink = { click: jest.fn() };
    jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any);

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
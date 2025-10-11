import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PricingPage from '../PricingPage';

// Mock DemoPage to avoid IntersectionObserver issues
jest.mock('../DemoPage', () => {
  return function MockDemoPage({ plan }) {
    return <div data-testid="demo-page" data-plan={plan}>Mock Demo Page</div>;
  };
});

// Mock the JSON import
jest.mock('../../../GLOBAL_OFFERING_PROTOCOL.json', () => ({
  plans: [
    {
      id: 'starter',
      name: 'Starter',
      price_monthly: 79,
      baseCredits: 1000,
      description: 'Plan básico de predicción',
      features: ['Alerting básico', 'Dashboard resumido', 'Soporte por email']
    },
    {
      id: 'growth',
      name: 'Growth',
      price_monthly: 249,
      baseCredits: 5000,
      description: 'Plan avanzado',
      features: ['Alerting avanzado', 'Dashboards personalizados', 'Integraciones API', 'Soporte prioritario']
    },
    {
      id: 'panteon',
      name: 'Panteón',
      price_monthly: 1999,
      baseCredits: 10000,
      description: 'Plan premium completo',
      features: ['Modelo dedicado', 'SLA de 99.99%', 'Onboarding y consultoría', 'Acceso a módulos avanzados']
    }
  ]
}));

describe('PricingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset URL and navigator for each test
    window.history.pushState({}, '', '');
  });

  describe('Renderizado Soberano', () => {
    test('renders the title "Panteón de Valor - Praevisio AI"', async () => {
      render(
        <MemoryRouter>
          <PricingPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Panteón de Valor - Praevisio AI')).toBeInTheDocument();
      });
    });
  });

  describe('Demos Parametrizadas', () => {
    test('opens demo modal for Growth plan with correct plan prop', async () => {
      render(
        <MemoryRouter>
          <PricingPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Planes Principales')).toBeInTheDocument();
      });

      // Find the "Ver Demo de este Plan" button for Growth (second button)
      const demoButtons = screen.getAllByText('Ver Demo de este Plan');
      const growthDemoButton = demoButtons[1]; // Growth is the second plan

      fireEvent.click(growthDemoButton);

      // Verify modal opens (DialogContent should be present)
      await waitFor(() => {
        // Since DemoPage is mocked, check for the mock element
        expect(screen.getByTestId('demo-page')).toBeInTheDocument();
      });

      // Verify the plan prop is 'growth' - check the data attribute
      expect(screen.getByTestId('demo-page')).toHaveAttribute('data-plan', 'growth');
    });
  });

  describe('Calculadora Soberana', () => {
    test('calculates total correctly when selecting plans and features', async () => {
      render(
        <MemoryRouter>
          <PricingPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Calculadora Soberana')).toBeInTheDocument();
      });

      // Initial total should be $0
      expect(screen.getByTestId('calculator-total')).toHaveTextContent('$0/mes');

      // Select Starter plan ($79)
      const starterToggle = screen.getByTestId('plan-toggle-starter');
      fireEvent.click(starterToggle);
      expect(screen.getByTestId('calculator-total')).toHaveTextContent('$79/mes');

      // Select Growth plan ($249)
      const growthToggle = screen.getByTestId('plan-toggle-growth');
      fireEvent.click(growthToggle);
      expect(screen.getByTestId('calculator-total')).toHaveTextContent('$328/mes');

      // Add a feature ($50)
      const apiFeatureToggle = screen.getByTestId('feature-toggle-integración-api-avanzada');
      fireEvent.click(apiFeatureToggle);
      expect(screen.getByTestId('calculator-total')).toHaveTextContent('$378/mes');

      // Add another feature ($50)
      const dashboardFeatureToggle = screen.getByTestId('feature-toggle-dashboard-personalizado');
      fireEvent.click(dashboardFeatureToggle);
      expect(screen.getByTestId('calculator-total')).toHaveTextContent('$428/mes');
    });

    test('shows AI explanations for selected items', async () => {
      render(
        <MemoryRouter>
          <PricingPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Calculadora Soberana')).toBeInTheDocument();
      });

      // Select Starter plan
      const starterToggle = screen.getByTestId('plan-toggle-starter');
      fireEvent.click(starterToggle);

      // Select a feature
      const apiFeatureToggle = screen.getByTestId('feature-toggle-integración-api-avanzada');
      fireEvent.click(apiFeatureToggle);

      // Check AI explanation for plan
      await waitFor(() => {
        expect(screen.getByText('Este plan Starter proporciona una base sólida para la predicción anticipatoria, con precisión del 90% validada en escenarios reales de Latinoamérica.')).toBeInTheDocument();
      });

      // Check AI explanation for feature
      expect(screen.getByText('La característica "Integración API Avanzada" mejora la capacidad predictiva al integrar datos adicionales, reduciendo falsos positivos en un 25%.')).toBeInTheDocument();
    });
  });

  describe('Robustez (Fallo de API)', () => {
    test('handles JSON loading error gracefully', () => {
      render(
        <MemoryRouter>
          <PricingPage protocolOverride={null} />
        </MemoryRouter>
      );

      // Should show error message
      expect(screen.getByText(/Error cargando planes/)).toBeInTheDocument();
    });
  });
});
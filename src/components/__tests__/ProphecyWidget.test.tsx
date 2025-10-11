import React from 'react';
import { render, screen } from '@testing-library/react';
import ProphecyWidget from '../ProphecyWidget';

describe('ProphecyWidget', () => {
  test('renders prophecy widget with title and description', () => {
    render(<ProphecyWidget />);

    expect(screen.getByText('Primera Profecía Global: Riesgo de Inestabilidad Social en LATAM')).toBeInTheDocument();
    expect(screen.getByText('Análisis predictivo de riesgo de inestabilidad social en Colombia, Perú y Argentina para los próximos 6 meses.')).toBeInTheDocument();
  });

  test('renders country risk cards with correct data', () => {
    render(<ProphecyWidget />);

    // Colombia
    expect(screen.getByText('Colombia')).toBeInTheDocument();
    expect(screen.getByText('Riesgo: 68%')).toBeInTheDocument();

    // Peru
    expect(screen.getByText('Perú')).toBeInTheDocument();
    expect(screen.getByText('Riesgo: 75%')).toBeInTheDocument();

    // Argentina
    expect(screen.getByText('Argentina')).toBeInTheDocument();
    expect(screen.getByText('Riesgo: 82%')).toBeInTheDocument();
  });

  test('renders country cards with correct styling', () => {
    render(<ProphecyWidget />);

    // Colombia card (red-600/20 background)
    const colombiaCard = screen.getByText('Colombia').closest('div');
    expect(colombiaCard).toHaveClass('bg-red-600/20', 'border', 'border-red-500', 'rounded', 'p-4');

    // Peru card (orange-600/20 background)
    const peruCard = screen.getByText('Perú').closest('div');
    expect(peruCard).toHaveClass('bg-orange-600/20', 'border', 'border-orange-500', 'rounded', 'p-4');

    // Argentina card (red-800/20 background)
    const argentinaCard = screen.getByText('Argentina').closest('div');
    expect(argentinaCard).toHaveClass('bg-red-800/20', 'border', 'border-red-700', 'rounded', 'p-4');
  });

  test('renders complete report link', () => {
    render(<ProphecyWidget />);

    const link = screen.getByText('Ver Informe Completo');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/INTELLIGENCE_REPORT_001.md');
    expect(link).toHaveClass('text-blue-400', 'underline', 'mt-4', 'block');
  });

  test('renders widget container with correct styling', () => {
    render(<ProphecyWidget />);

    const container = screen.getByText('Primera Profecía Global: Riesgo de Inestabilidad Social en LATAM').closest('div');
    expect(container).toHaveClass('bg-etherblue-dark/60', 'border', 'border-gray-700', 'rounded-lg', 'p-6', 'mt-8');
  });

  test('renders grid layout for country cards', () => {
    render(<ProphecyWidget />);

    const grid = screen.getByText('Colombia').closest('.grid');
    expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-4');
  });

  test('renders all country cards in correct order', () => {
    render(<ProphecyWidget />);

    const cards = screen.getAllByRole('generic', { hidden: true }).filter(
      element => element.className.includes('bg-red-600/20') ||
                 element.className.includes('bg-orange-600/20') ||
                 element.className.includes('bg-red-800/20')
    );

    expect(cards).toHaveLength(3);

    // Check order
    expect(cards[0]).toHaveTextContent('Colombia');
    expect(cards[1]).toHaveTextContent('Perú');
    expect(cards[2]).toHaveTextContent('Argentina');
  });

  test('renders risk percentages correctly', () => {
    render(<ProphecyWidget />);

    // Find elements containing risk percentages
    const riskElements = screen.getAllByText(/Riesgo: \d+%/);

    expect(riskElements).toHaveLength(3);
    expect(riskElements[0]).toHaveTextContent('Riesgo: 68%');
    expect(riskElements[1]).toHaveTextContent('Riesgo: 75%');
    expect(riskElements[2]).toHaveTextContent('Riesgo: 82%');
  });

  test('renders country names with bold styling', () => {
    render(<ProphecyWidget />);

    const colombiaTitle = screen.getByText('Colombia');
    const peruTitle = screen.getByText('Perú');
    const argentinaTitle = screen.getByText('Argentina');

    expect(colombiaTitle).toHaveClass('font-bold');
    expect(peruTitle).toHaveClass('font-bold');
    expect(argentinaTitle).toHaveClass('font-bold');
  });

  test('renders description with correct styling', () => {
    render(<ProphecyWidget />);

    const description = screen.getByText('Análisis predictivo de riesgo de inestabilidad social en Colombia, Perú y Argentina para los próximos 6 meses.');
    expect(description).toHaveClass('text-gray-300', 'mb-4');
  });

  test('renders title with correct styling', () => {
    render(<ProphecyWidget />);

    const title = screen.getByText('Primera Profecía Global: Riesgo de Inestabilidad Social en LATAM');
    expect(title).toHaveClass('text-xl', 'font-bold', 'mb-4');
  });
});
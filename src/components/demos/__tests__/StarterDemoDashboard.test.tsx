import React from 'react';
import { render, screen } from '@testing-library/react';
import StarterDemoDashboard from '../StarterDemoDashboard';

const mockData = {
  kpis: { precisionPromedio: 88, prediccionesDiarias: 120, monitoreoContinuo: 24, coberturaRegional: 6 },
  countries: [{ name: 'Colombia', code: 'COL' }],
  lastUpdated: '2025-10-12'
};

test('StarterDemoDashboard renders KPIs and gallery', () => {
  render(<StarterDemoDashboard data={mockData as any} />);
  expect(screen.getByText(/Starter — KPIs Esenciales/i)).toBeInTheDocument();
  expect(screen.getByText(/Galería de Misiones/i)).toBeInTheDocument();
});

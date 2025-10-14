import React from 'react';
import { render, screen } from '@testing-library/react';
import GrowthDemoDashboard from '../GrowthDemoDashboard';

const mockData = {
  kpis: { precisionPromedio: 90, prediccionesDiarias: 150, monitoreoContinuo: 24, coberturaRegional: 8 },
  countries: [{ name: 'Perú', code: 'PER' }],
  communityResilience: {},
  foodSecurity: {},
};

test('GrowthDemoDashboard renders simulation panel and widgets', () => {
  render(<GrowthDemoDashboard data={mockData as any} />);
  expect(screen.getByText(/Growth — Panel de Simulación/i)).toBeInTheDocument();
  // Puede haber múltiples ocurrencias (heading + widget), comprobamos al menos una
  const matches = screen.getAllByText(/Resiliencia Comunitaria/i);
  expect(matches.length).toBeGreaterThan(0);
});

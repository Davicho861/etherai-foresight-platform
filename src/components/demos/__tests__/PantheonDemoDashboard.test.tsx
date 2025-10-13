import React from 'react';
import { render, screen } from '@testing-library/react';
import PantheonDemoDashboard from '../PantheonDemoDashboard';

const mockData = {
  kpis: { precisionPromedio: 95, prediccionesDiarias: 200, monitoreoContinuo: 24, coberturaRegional: 12 },
  countries: [{ name: 'Brasil', code: 'BRA' }],
  ethicalAssessment: { overallScore: 50 },
};

test('PantheonDemoDashboard renders SDLC and ethical vector', () => {
  render(<PantheonDemoDashboard data={mockData as any} />);
  expect(screen.getByText(/Panteón — SDLC/i)).toBeInTheDocument();
  const matches = screen.getAllByText(/Vector Ético/i);
  expect(matches.length).toBeGreaterThan(0);
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import MetatronPanel from '../../pages/MetatronPanel';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../lib/eternalVigilanceSimulator', () => ({
  startSimulator: jest.fn(),
  stopSimulator: jest.fn(),
  subscribeEvents: () => {},
  getCurrentState: () => ({ indices: { globalRisk: 5, stability: 95 }, flows: {} }),
  downloadReport: jest.fn(),
}));

test('MetatronPanel renderiza y muestra controles', () => {
  // jsdom en CI no implementa matchMedia; mockeamos para los hooks que lo usan
  // (use-mobile hook)
  // @ts-ignore
  if (typeof window.matchMedia !== 'function') {
    // @ts-ignore
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }
  render(
    <MemoryRouter>
      <MetatronPanel />
    </MemoryRouter>
  );
  expect(screen.getByText(/Metatrón - Centro de Operaciones/i)).toBeInTheDocument();
  const btn = screen.getByRole('button', { name: /Iniciar Vigilia|Detener Vigilia/i });
  expect(btn).toBeInTheDocument();
});

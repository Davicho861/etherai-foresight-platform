import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InteractiveDashboard from '../InteractiveDashboard';

beforeEach(() => {
  // @ts-ignore
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ predictionId: 'pred_1', confidence: 0.8, factors: [{ name: 'Infection rate', weight: 0.6, value: 60 }], risk: 'medium' }) }));
});

test('Generar Predicción llama a la API y muestra resultados', async () => {
  render(<InteractiveDashboard />);
  const button = screen.getByRole('button', { name: /Generar Predicción/i });
  fireEvent.click(button);
  await waitFor(() => expect(screen.getByText(/Confianza/i)).toBeInTheDocument());
  expect(global.fetch).toHaveBeenCalled();
});

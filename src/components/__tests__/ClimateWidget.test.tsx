import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClimateWidget from '../ClimateWidget';

// Mock de la API fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        temperature: 25,
        humidity: 60,
        precipitation_probability: 10,
        weather_code: 1,
        wind_speed: 5,
        time: ['2025-10-08'],
        temperature_2m_max: [28],
        temperature_2m_min: [18],
        precipitation_sum: [0.1],
        weathercode: [1],
      }),
  })
) as jest.Mock;

describe('ClimateWidget', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('debería renderizar y mostrar los datos iniciales para Bogotá', async () => {
    render(<ClimateWidget />);

    // Espera a que se muestre el clima actual
    await waitFor(() => {
      expect(screen.getByText(/Clima Actual en Bogotá/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/25°C/i)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('lat=4.711'));
  });

  it('debería cambiar de ciudad y actualizar los datos automáticamente', async () => {
    render(<ClimateWidget />);

    // Espera a que carguen los datos iniciales
    await waitFor(() => {
      expect(screen.getByText(/Clima Actual en Bogotá/i)).toBeInTheDocument();
    });

    // Cambia la ciudad a "São Paulo"
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'São Paulo' } });

    // El useEffect debería disparar el fetch automáticamente.
    // Esperamos a que la llamada a fetch se haga con las nuevas coordenadas.
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('lat=-23.5505'));
    });

    // Y luego verificamos que el título se actualice para reflejar la nueva ciudad.
    await waitFor(() => {
        expect(screen.getByText(/Clima Actual en São Paulo/i)).toBeInTheDocument();
    });
  });
});

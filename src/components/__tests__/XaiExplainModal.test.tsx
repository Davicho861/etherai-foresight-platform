import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import XaiExplainModal from '../../components/widgets/XaiExplainModal';

describe('XaiExplainModal', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('muestra la explicación devuelta por la API', async () => {
    const mockExplain = { explanation: 'Explicación desde servidor.' };
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockExplain,
    } as any);

    const onClose = jest.fn();
    render(<XaiExplainModal open={true} onClose={onClose} metric="Indice" value={42} context="Prueba" />);

    expect(screen.getByText(/Generando interpretación del Oráculo/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/Explicación desde servidor/i)).toBeInTheDocument());

  // cerrar
  fireEvent.click(screen.getByText(/Cerrar/i));
    expect(onClose).toHaveBeenCalled();
  });

  test('usa fallback cuando la petición falla', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('network'));

    const onClose = jest.fn();
    render(<XaiExplainModal open={true} onClose={onClose} metric="Riesgo" value={'alto'} context="Zona A" />);

    expect(screen.getByText(/Generando interpretación del Oráculo/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/El Oráculo \(fallback\) interpreta que/)).toBeInTheDocument());

    // Debe mostrar nota de fallback
    expect(screen.getByText(/Nota: explicación desde fallback/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/Cerrar/i));
    expect(onClose).toHaveBeenCalled();
  });

  test('muestra explanation, confidence y sources cuando la API responde con formato estructurado', async () => {
    const mockExplain = { explanation: 'Explicación de prueba', confidence: 0.82, sources: ['DB:metrics-2025', 'Informe: Q3-resumen'] };
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockExplain,
    } as any);

    const onClose = jest.fn();
    render(<XaiExplainModal open={true} onClose={onClose} metric="test.metric" value={123} context="Contexto test" />);

    await waitFor(() => expect(screen.getByText(/Explicación de prueba/)).toBeInTheDocument());

    // Confianza y fuentes deben mostrarse
    expect(screen.getByText(/Confianza estimada/i)).toBeInTheDocument();
    expect(screen.getByText(/82%/)).toBeInTheDocument();
    expect(screen.getByText(/DB:metrics-2025/)).toBeInTheDocument();
    expect(screen.getByText(/Informe: Q3-resumen/)).toBeInTheDocument();

    // cerrar
    fireEvent.click(screen.getByText(/Cerrar/i));
    expect(onClose).toHaveBeenCalled();
  });
});

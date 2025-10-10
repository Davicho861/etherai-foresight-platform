import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetatronPanelWidget from '../MetatronPanelWidget';

describe('MetatronPanelWidget', () => {
  const defaultProps = {
    running: false,
    toggleVigilance: jest.fn(),
    emitMessage: '',
    setEmitMessage: jest.fn(),
    handleEmit: jest.fn(),
    handleDownload: jest.fn(),
    sseConnected: true,
    events: ['Event 1', 'Event 2'],
    state: {
      indices: { globalRisk: 25.5, stability: 74.2 },
      riskIndices: {
        'Colombia': { level: 'Medio', riskScore: 45.2 },
        'México': { level: 'Alto', riskScore: 67.8 },
        'Brasil': { level: 'Bajo', riskScore: 23.1 }
      },
      activityFeed: [
        { flow: 'Auto-Preservación', message: 'Sistema operativo', timestamp: '2025-10-10T19:00:00Z' },
        { flow: 'Conocimiento', message: 'Datos actualizados', timestamp: '2025-10-10T18:30:00Z' },
        { flow: 'Profecía', message: 'Predicción completada', timestamp: '2025-10-10T18:00:00Z' }
      ]
    }
  };

  it('renders component with default props', () => {
    render(<MetatronPanelWidget {...defaultProps} />);

    expect(screen.getByText('Centro de Operaciones - Aion')).toBeInTheDocument();
    expect(screen.getByText('Vigilia Eterna Activa')).toBeInTheDocument();
    expect(screen.getByText('SSE Conectado')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Vigilia')).toBeInTheDocument();
  });

  it('displays SSE disconnected status', () => {
    render(<MetatronPanelWidget {...defaultProps} sseConnected={false} />);

    expect(screen.getByText('SSE Desconectado')).toBeInTheDocument();
  });

  it('shows running state with stop button', () => {
    render(<MetatronPanelWidget {...defaultProps} running={true} />);

    expect(screen.getByText('Detener Vigilia')).toBeInTheDocument();
  });

  it('displays global risk indices', () => {
    render(<MetatronPanelWidget {...defaultProps} />);

    expect(screen.getByText('25.5%')).toBeInTheDocument();
    expect(screen.getByText('Estabilidad Global: 74.2%')).toBeInTheDocument();
  });

  it('renders risk indices for countries', () => {
    render(<MetatronPanelWidget {...defaultProps} />);

    expect(screen.getByText('Colombia')).toBeInTheDocument();
    expect(screen.getByText('México')).toBeInTheDocument();
    expect(screen.getByText('Brasil')).toBeInTheDocument();
    expect(screen.getByText('45.2')).toBeInTheDocument();
    expect(screen.getByText('67.8')).toBeInTheDocument();
    expect(screen.getByText('23.1')).toBeInTheDocument();
  });

  it('applies correct risk level colors', () => {
    render(<MetatronPanelWidget {...defaultProps} />);

    // Check for color classes - these are applied via Tailwind
    const medioElement = screen.getByText('Medio');
    const altoElement = screen.getByText('Alto');
    const bajoElement = screen.getByText('Bajo');

    expect(medioElement).toHaveClass('text-yellow-400');
    expect(altoElement).toHaveClass('text-red-400');
    expect(bajoElement).toHaveClass('text-green-400');
  });

  it('displays activity feed with flow indicators', () => {
    render(<MetatronPanelWidget {...defaultProps} />);

    expect(screen.getByText('Sistema operativo')).toBeInTheDocument();
    expect(screen.getByText('Datos actualizados')).toBeInTheDocument();
    expect(screen.getByText('Predicción completada')).toBeInTheDocument();

    // Check flow names
    expect(screen.getByText('Auto-Preservación')).toBeInTheDocument();
    expect(screen.getByText('Conocimiento')).toBeInTheDocument();
    expect(screen.getByText('Profecía')).toBeInTheDocument();
  });

  it('renders activity feed with timestamps', () => {
    render(<MetatronPanelWidget {...defaultProps} />);

    // Check that flow names are displayed
    expect(screen.getByText('Auto-Preservación')).toBeInTheDocument();
    expect(screen.getByText('Conocimiento')).toBeInTheDocument();
    expect(screen.getByText('Profecía')).toBeInTheDocument();
  });

  it('handles emit message input', () => {
    render(<MetatronPanelWidget {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enviar mensaje a Aion...');
    fireEvent.change(input, { target: { value: 'Test message' } });

    expect(defaultProps.setEmitMessage).toHaveBeenCalledWith('Test message');
  });

  it('calls handleEmit when send button is clicked', () => {
    render(<MetatronPanelWidget {...defaultProps} />);

    const sendButton = screen.getByText('Enviar');
    fireEvent.click(sendButton);

    expect(defaultProps.handleEmit).toHaveBeenCalled();
  });

  it('calls handleDownload when download button is clicked', () => {
    render(<MetatronPanelWidget {...defaultProps} />);

    const downloadButton = screen.getByText('Descargar Reporte');
    fireEvent.click(downloadButton);

    expect(defaultProps.handleDownload).toHaveBeenCalled();
  });

  it('calls toggleVigilance when vigilance button is clicked', () => {
    render(<MetatronPanelWidget {...defaultProps} />);

    const toggleButton = screen.getByText('Iniciar Vigilia');
    fireEvent.click(toggleButton);

    expect(defaultProps.toggleVigilance).toHaveBeenCalled();
  });

  it('displays recent SSE events', () => {
    render(<MetatronPanelWidget {...defaultProps} />);

    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });

  it('limits SSE events display to 10', () => {
    const manyEvents = Array.from({ length: 15 }, (_, i) => `Event ${i + 1}`);
    render(<MetatronPanelWidget {...defaultProps} events={manyEvents} />);

    // Should only show first 10
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 10')).toBeInTheDocument();
    expect(screen.queryByText('Event 11')).not.toBeInTheDocument();
  });

  it('handles empty state gracefully', () => {
    const emptyProps = {
      ...defaultProps,
      state: null,
      events: [],
      riskIndices: {}
    };

    render(<MetatronPanelWidget {...emptyProps} />);

    // Should not crash and show default values
    expect(screen.getByText('0.0%')).toBeInTheDocument();
    expect(screen.getByText('Estabilidad Global: 100.0%')).toBeInTheDocument();
  });

  it('renders with empty activity feed', () => {
    const emptyFeedProps = {
      ...defaultProps,
      state: { ...defaultProps.state, activityFeed: [] }
    };

    render(<MetatronPanelWidget {...emptyFeedProps} />);

    // Should render without activity items
    expect(screen.queryByText('Sistema operativo')).not.toBeInTheDocument();
  });
});
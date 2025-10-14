import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SdlcDashboardPage from '../../pages/SdlcDashboardPage';

// Mock fetch
global.fetch = jest.fn();

const mockSDLCData = {
  sdlc: [
    {
      filename: '01_PLANNING_CEO_CFO_CMO.md',
      sections: [
        { title: 'CEO (Aion) - Visión Estratégica y Misión', content: 'Como CEO de Aion...' },
        { title: 'CFO (Hades) - Modelo de Negocio y Costo Cero', content: 'Como Hades...' },
        { title: 'CMO (Apolo) - Estrategia de Mercado y Engagement', content: 'Como Apolo...' }
      ]
    }
  ],
  kanban: {
    columns: [
      { name: 'Backlog', tasks: ['MIS-001: Integración de Datos', 'MIS-002: Monitoreo Sísmico'] },
      { name: 'En Progreso', tasks: ['MIS-005: Datos Climáticos'] },
      { name: 'Completadas', tasks: ['MIS-003: IA Ética', 'MIS-014: Optimización Backend'] }
    ]
  },
  kpis: {
    'Uptime': '99.99%',
    'API Latency': '120ms',
    'Flujos Perpetuos': 'Activos',
    'Multi-Domain Risk': '15%'
  }
};

describe('SdlcDashboardPage', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    // Return different responses depending on the requested URL
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/sdlc/full-state') {
        return Promise.resolve({ ok: true, json: async () => mockSDLCData });
      }

      if (url === '/api/kanban/board') {
        const columns = mockSDLCData.kanban.columns.map((col, idx) => ({
          name: col.name,
          tasks: (col.tasks || []).map((t: string, j: number) => ({ id: `task-${idx}-${j}`, title: t }))
        }));
        return Promise.resolve({ ok: true, json: async () => ({ columns }) });
      }

      return Promise.resolve({ ok: false, status: 404 });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dashboard title', async () => {
    render(<SdlcDashboardPage />);
  expect(screen.getByText('Apolo — Panteón de la Gobernanza (SDLC)')).toBeInTheDocument();
  });

  it('loads and displays SDLC data on mount', async () => {
    await act(async () => {
      render(<SdlcDashboardPage />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/sdlc/full-state');
    });

    await waitFor(() => {
      expect(screen.getByText('El Kanban Viviente')).toBeInTheDocument();
    });
  });

  it('displays sidebar modules', async () => {
    render(<SdlcDashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Vista General')).toBeInTheDocument();
      expect(screen.getByText('Planificación')).toBeInTheDocument();
      expect(screen.getByText('Diseño')).toBeInTheDocument();
      expect(screen.getByText('Implementación')).toBeInTheDocument();
      expect(screen.getByText('Pruebas')).toBeInTheDocument();
      expect(screen.getByText('Despliegue')).toBeInTheDocument();
    });
  });

  it('switches to PLANNING module when clicked', async () => {
    await act(async () => {
      render(<SdlcDashboardPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('El Kanban Viviente')).toBeInTheDocument();
    });

  const planningModule = screen.getAllByRole('button', { name: /Planificación/ })[0];
  fireEvent.click(planningModule);

    await waitFor(() => {
      // The planning module renders the PlanningDashboard header and metrics
      expect(screen.getByText(/Santuario de la Planificación/)).toBeInTheDocument();
      expect(screen.getByText(/Progreso de Planificación/)).toBeInTheDocument();
    });
  });

  it('switches to DESIGN module when clicked', async () => {
    await act(async () => {
      render(<SdlcDashboardPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('El Kanban Viviente')).toBeInTheDocument();
    });

  const designModule = screen.getAllByRole('button', { name: /Diseño/ })[0];
  fireEvent.click(designModule);

    await waitFor(() => {
      // The design module renders the DesignDashboard header
      expect(screen.getByText(/Santuario del Diseño/)).toBeInTheDocument();
      expect(screen.getByText(/Completitud del Diseño/)).toBeInTheDocument();
    });
  });

  it('switches to IMPLEMENTATION module when clicked', async () => {
    await act(async () => {
      render(<SdlcDashboardPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('El Kanban Viviente')).toBeInTheDocument();
    });

  const implementationModule = screen.getAllByRole('button', { name: /Implementación/ })[0];
  fireEvent.click(implementationModule);

    await waitFor(() => {
      // Implementation dashboard contains forge header and agent engine status
      expect(screen.getByText(/Santuario de la Forja/)).toBeInTheDocument();
      expect(screen.getByText(/Estado del Motor de Agentes/)).toBeInTheDocument();
    });
  });

  it('switches to TESTING module when clicked', async () => {
    await act(async () => {
      render(<SdlcDashboardPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('El Kanban Viviente')).toBeInTheDocument();
    });

  const testingModule = screen.getAllByRole('button', { name: /Pruebas/ })[0];
  fireEvent.click(testingModule);

    await waitFor(() => {
      // Testing dashboard shows judgement header and quality dashboard
      expect(screen.getByText(/Santuario del Juicio/)).toBeInTheDocument();
      expect(screen.getByText(/Dashboard de Calidad de Código/)).toBeInTheDocument();
    });
  });

  it('switches to DEPLOYMENT module when clicked', async () => {
    await act(async () => {
      render(<SdlcDashboardPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('El Kanban Viviente')).toBeInTheDocument();
    });

  const deploymentModule = screen.getAllByRole('button', { name: /Despliegue/ })[0];
  fireEvent.click(deploymentModule);

    await waitFor(() => {
      expect(screen.getByText('El Vuelo de Hermes')).toBeInTheDocument();
      expect(screen.getByText('Estado del Despliegue')).toBeInTheDocument();
    });
  });

  it('displays Kanban board with correct columns and tasks', async () => {
    await act(async () => {
      render(<SdlcDashboardPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Backlog')).toBeInTheDocument();
      expect(screen.getByText('En Progreso')).toBeInTheDocument();
      expect(screen.getByText('Completadas')).toBeInTheDocument();
      expect(screen.getByText('MIS-001: Integración de Datos')).toBeInTheDocument();
      expect(screen.getByText('MIS-003: IA Ética')).toBeInTheDocument();
    });
  });

  it('displays global KPIs in overview', async () => {
    await act(async () => {
      render(<SdlcDashboardPage />);
    });

    // Assert that key KPI values are rendered
    await waitFor(() => {
      expect(screen.getAllByText('99.99%')).toHaveLength(2);
      expect(screen.getAllByText('120ms')).toHaveLength(2);
      expect(screen.getAllByText('Activos')).toHaveLength(2);
    });
  });

  it('toggles sidebar collapse', async () => {
    await act(async () => {
      render(<SdlcDashboardPage />);
    });

    const toggleButton = screen.getAllByText('◀️')[0];
    fireEvent.click(toggleButton);

    expect(screen.getAllByText('▶️')[0]).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

    await act(async () => {
      render(<SdlcDashboardPage />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/sdlc/full-state');
    });

  // Should still render the UI even with API error
  expect(screen.getByText('Apolo — Panteón de la Gobernanza (SDLC)')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<SdlcDashboardPage />);

  expect(screen.getByText('Cargando el Panteón de la Gobernanza...')).toBeInTheDocument();
  });
});
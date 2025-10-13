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
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockSDLCData
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dashboard title', async () => {
    render(<SdlcDashboardPage />);
    expect(screen.getByText('Apolo — Espejo de la Soberanía (SDLC)')).toBeInTheDocument();
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

    const planningModule = screen.getByText('Planificación');
    fireEvent.click(planningModule);

    await waitFor(() => {
      expect(screen.getByText('Junta Directiva de Aion')).toBeInTheDocument();
      expect(screen.getByText('Aion (CEO)')).toBeInTheDocument();
      expect(screen.getByText('Hades (CFO)')).toBeInTheDocument();
      expect(screen.getByText('Apolo (CMO)')).toBeInTheDocument();
    });
  });

  it('switches to DESIGN module when clicked', async () => {
    await act(async () => {
      render(<SdlcDashboardPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('El Kanban Viviente')).toBeInTheDocument();
    });

    const designModule = screen.getByText('Diseño');
    fireEvent.click(designModule);

    await waitFor(() => {
      expect(screen.getByText('Consejo Técnico Soberano')).toBeInTheDocument();
      expect(screen.getByText('Hefesto (CTO)')).toBeInTheDocument();
      expect(screen.getByText('Cronos (CIO)')).toBeInTheDocument();
      expect(screen.getByText('Ares (CSO)')).toBeInTheDocument();
    });
  });

  it('switches to IMPLEMENTATION module when clicked', async () => {
    await act(async () => {
      render(<SdlcDashboardPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('El Kanban Viviente')).toBeInTheDocument();
    });

    const implementationModule = screen.getByText('Implementación');
    fireEvent.click(implementationModule);

    await waitFor(() => {
      expect(screen.getByText('La Forja de Hefesto')).toBeInTheDocument();
      expect(screen.getByText('Estado del Motor de Agentes')).toBeInTheDocument();
    });
  });

  it('switches to TESTING module when clicked', async () => {
    await act(async () => {
      render(<SdlcDashboardPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('El Kanban Viviente')).toBeInTheDocument();
    });

    const testingModule = screen.getByText('Pruebas');
    fireEvent.click(testingModule);

    await waitFor(() => {
      expect(screen.getByText('El Juicio de Ares')).toBeInTheDocument();
      expect(screen.getByText('Dashboard de Calidad de Código')).toBeInTheDocument();
      expect(screen.getAllByText('84.11%')).toHaveLength(2);
    });
  });

  it('switches to DEPLOYMENT module when clicked', async () => {
    await act(async () => {
      render(<SdlcDashboardPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('El Kanban Viviente')).toBeInTheDocument();
    });

    const deploymentModule = screen.getByText('Despliegue');
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

    await waitFor(() => {
      expect(screen.getByText('KPIs de Salud Global')).toBeInTheDocument();
      expect(screen.getByText('99.99%')).toBeInTheDocument();
      expect(screen.getByText('120ms')).toBeInTheDocument();
      expect(screen.getByText('Activos')).toBeInTheDocument();
    });
  });

  it('toggles sidebar collapse', async () => {
    await act(async () => {
      render(<SdlcDashboardPage />);
    });

    const toggleButton = screen.getByText('◀️');
    fireEvent.click(toggleButton);

    expect(screen.getByText('▶️')).toBeInTheDocument();
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
    expect(screen.getByText('Apolo — Espejo de la Soberanía (SDLC)')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<SdlcDashboardPage />);

    expect(screen.getByText('Cargando el Espejo de la Soberanía...')).toBeInTheDocument();
  });
});
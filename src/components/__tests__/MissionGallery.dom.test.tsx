import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import MissionGallery from '../MissionGallery';

const mockMissions = {
  missions: [
    {
      id: 'm1',
      title: 'Misión Demo 1',
      description: 'Descripción de la misión demo 1',
      objective: 'Objetivo 1',
      result: 'Resultado 1',
      ethicalVector: [0.85, 0.92],
      timestamp: Date.now(),
      status: 'completed'
    },
    {
      id: 'm2',
      title: 'Misión Demo 2',
      description: 'Descripción de la misión demo 2',
      objective: 'Objetivo 2',
      result: 'Resultado 2',
      ethicalVector: [0.78, 0.88],
      timestamp: Date.now() - 86400000,
      status: 'pending'
    }
  ]
};

describe('MissionGallery (DOM)', () => {
  const mockOnMissionSelect = jest.fn();

  beforeEach(() => {
    // Mock global.fetch used by the component
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockMissions)
    } as Response);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockOnMissionSelect.mockClear();
  });

  test('renders mission cards and handles selection', async () => {
    const { rerender } = render(<MissionGallery onMissionSelect={mockOnMissionSelect} />);

    // Wait for the cards to appear
    await waitFor(() => expect(screen.getByText('Misión Demo 1')).toBeInTheDocument());

    // Verify both mission titles are rendered
    expect(screen.getByText('Misión Demo 1')).toBeInTheDocument();
    expect(screen.getByText('Misión Demo 2')).toBeInTheDocument();

    // Verify descriptions are rendered
    expect(screen.getByText('Descripción de la misión demo 1')).toBeInTheDocument();
    expect(screen.getByText('Descripción de la misión demo 2')).toBeInTheDocument();

    // Verify ethical vector is displayed (rounded to 85%)
    expect(screen.getByText('Ético: 85%')).toBeInTheDocument();

    // Click first card to select
    fireEvent.click(screen.getByText('Misión Demo 1'));

    // Verify onMissionSelect was called with the mission id
    expect(mockOnMissionSelect).toHaveBeenCalledWith('m1');

    // Re-render with selected mission to test deselection
    rerender(<MissionGallery onMissionSelect={mockOnMissionSelect} selectedMissionId="m1" />);

    // Click again to deselect
    fireEvent.click(screen.getByText('Misión Demo 1'));
    expect(mockOnMissionSelect).toHaveBeenCalledWith(null);
  });

  test('displays loading state initially', () => {
    render(<MissionGallery onMissionSelect={mockOnMissionSelect} />);

    expect(screen.getByText('Cargando misiones...')).toBeInTheDocument();
  });

  test('displays no missions message when empty', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ missions: [] })
      })
    ) as any;

    render(<MissionGallery onMissionSelect={mockOnMissionSelect} />);

    await waitFor(() => expect(screen.getByText('No hay misiones disponibles')).toBeInTheDocument());
  });
});

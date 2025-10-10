import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MissionGallery from '../MissionGallery';

const mockReplays = {
  taskReplays: [
    { id: 'r1', title: 'Demo 1', description: 'Desc 1', fullText: 'Full text 1' },
    { id: 'r2', title: 'Demo 2', description: 'Desc 2', fullText: 'Full text 2' }
  ]
};

describe('MissionGallery (DOM)', () => {
  beforeEach(() => {
    // Mock global.fetch used by the component
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockReplays) })) as any;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders mission cards and shows selected replay content', async () => {
    render(<MissionGallery />);

    // Wait for the cards to appear
    await waitFor(() => expect(screen.getByText(/Demo 1/)).toBeInTheDocument());

    // Click first card
    fireEvent.click(screen.getByText(/Demo 1/));

    // After clicking, the full text should appear (eventually, after typewriter)
    await waitFor(() => expect(screen.getByText(/Full text 1/)).toBeInTheDocument());
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CommandCenterLayout from '../CommandCenterLayout';

describe('CommandCenterLayout mock toggle', () => {
  beforeEach(() => {
    // Ensure a clean localStorage
    window.localStorage.removeItem('NATIVE_DEV_MODE');
  });

  test('toggle button updates localStorage and banner visibility', () => {
    render(
      <MemoryRouter>
        <CommandCenterLayout />
      </MemoryRouter>
    );

    // The toggle button must be present
    const toggle = screen.getByTestId('mock-toggle-btn');
    expect(toggle).toBeInTheDocument();

    // Initially off
    expect(window.localStorage.getItem('NATIVE_DEV_MODE')).not.toBe('true');
    expect(screen.queryByText(/MODO SIMULADO/i)).not.toBeInTheDocument();

    // Click to enable
    fireEvent.click(toggle);
    expect(window.localStorage.getItem('NATIVE_DEV_MODE')).toBe('true');
    expect(screen.getByText(/MODO SIMULADO/i)).toBeInTheDocument();

    // Click to disable
    fireEvent.click(toggle);
    expect(window.localStorage.getItem('NATIVE_DEV_MODE')).toBe('false');
    expect(screen.queryByText(/MODO SIMULADO/i)).not.toBeInTheDocument();
  });
});

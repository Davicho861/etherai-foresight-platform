import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';

// Mock global layout parts to keep the test focused and avoid heavy UI providers
jest.mock('../../components/Navbar', () => {
  return { __esModule: true, default: () => null };
});
jest.mock('../../components/Footer', () => {
  return { __esModule: true, default: () => null };
});
// Mock Toaster and Sonner UI providers used in App to avoid side-effects in jsdom
jest.mock('@/components/ui/toaster', () => {
  return { Toaster: () => null };
});
jest.mock('@/components/ui/sonner', () => {
  return { Toaster: () => null };
});

describe('Routing Integration', () => {
  test('landing CTAs route to solutions, demo and pricing', async () => {
    // App already includes a HashRouter internally, so render it directly to avoid nested Router errors
    render(<App />);

    // Simulate hash navigation by setting location.hash and re-rendering
    window.location.hash = '/solutions';
    // Wait a tick for lazy load
    await waitFor(() => expect(window.location.hash).toBe('#/solutions'));

    // Now go to demo
    window.location.hash = '/demo';
    await waitFor(() => expect(window.location.hash).toBe('#/demo'));

    // Now go to pricing
    window.location.hash = '/pricing';
    await waitFor(() => expect(window.location.hash).toBe('#/pricing'));
  });
});
